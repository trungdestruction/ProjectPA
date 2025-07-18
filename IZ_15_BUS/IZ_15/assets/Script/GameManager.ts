import { _decorator, color, Component, instantiate, Label, Node, Prefab, tween, Vec3 } from 'cc';
import super_html_playable from './src/super_html/super_html_playable';
import { Row } from './Row';
import { BoatController } from './src/BoatController';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.zombie";
const iosUrl = "https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059";

@ccclass('GameManager')
export class GameManager extends Component {
    @property([Row])
    row: Row[] = [];

    @property(Label)
    textMoney: Label = null;

    @property(Node)
    moneyEnd: Node = null;

    @property(Prefab)
    vfxCoin: Prefab = null;

    @property(Node)
    btnUpgrade: Node = null;

    @property(Label)
    labelBtnUpgrade: Label = null;

    @property(Node)
    tutHand: Node = null;

    @property(Node)
    tutHandBtn: Node = null;

    @property(Node)
    mapUp: Node = null;

    @property(Node)
    mapDown: Node = null;

    @property([Prefab])
    zombieUp: Prefab[] = [];

    @property([Prefab])
    zombieDown: Prefab[] = [];

    countTime: number = 0;
    tutActive: boolean = false;
    money: number = 100;
    currentMoney: number = 100;
    firstClick: boolean = false;
    btnClickStore: boolean = false;
    countStore: number = 0;
    btnUpgradePrice: number = 300;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.idle.zombie");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059");
    }

    protected update(dt: number): void {
        if (!this.tutActive) {
            this.countTime += dt;
            if (this.countTime >= 2) {
                this.tutHand.active = true;
                this.tutActive = true;
            }
        }
        if (this.currentMoney < this.money) {
            this.currentMoney += 5;
            this.textMoney.string = this.currentMoney.toString();
        }
        if (this.currentMoney > this.money) {
            this.currentMoney -= 5;
            this.textMoney.string = this.currentMoney.toString();
        }
    }

    showBtnUpgrade() {
        if (!this.firstClick) {
            this.firstClick = true;
            this.btnUpgrade.active = true;
        }
    }

    updateMoney(num: number) {
        this.tutActive = true;
        this.tutHand.active = false;
        this.money += num;
        this.row.forEach(row => {
            row.activeLine(this.money);
        });
        if (this.money < this.btnUpgradePrice) {
            this.labelBtnUpgrade.color = color(255, 0, 0);
            this.tutHandBtn.active = false;
        }
        else {
            this.tutHandBtn.active = true;
            this.labelBtnUpgrade.color = color(255, 255, 255);
        }
    }

    upgradeBoat() {
        if (this.btnClickStore) {
            this.onHandlerGotoStore();
        }
        if (this.money < this.btnUpgradePrice) return;
        AudioManager.getInstance().playSoundUpgade();
        this.updateMoney(-this.btnUpgradePrice);
        this.btnClickStore = true;
        this.btnUpgradePrice = 500;
        this.labelBtnUpgrade.string = this.btnUpgradePrice.toString();
        if (this.money < this.btnUpgradePrice) {
            this.labelBtnUpgrade.color = color(255, 0, 0);
        }
        else {
            this.labelBtnUpgrade.color = color(255, 255, 255);
        }
        BoatController.getInstance().upgradeBoat();
    }

    spawnVfxCoin() {
        let ran = Math.floor(Math.random() * 5 + 10);
        let delay = 0;
        for (let i = 0; i < ran; i++) {
            tween(this.node)
                .delay(delay)
                .call(() => {
                    let ranX = Math.floor(Math.random() * (200 - 80) + 80);
                    let ranY = Math.floor(Math.random() * (400 - 280) + 280);
                    let coin = instantiate(this.vfxCoin);
                    coin.parent = this.node;
                    coin.position = new Vec3(ranX, ranY, 0);
                    coin.scale = Vec3.ZERO;
                    tween(coin)
                        .to(0.08, { scale: new Vec3(0.8, 0.8, 0.8) })
                        .delay(delay)
                        .to(0.3, { worldPosition: this.moneyEnd.worldPosition, scale: new Vec3(1.2, 1.2, 1.2) })
                        .call(() => {
                            coin.destroy();
                        })
                        .start();
                })
                .start();
            delay += 0.01;
        }
    }

    toStore() {
        this.countStore += 1;
        if (this.countStore >= 5) {
            this.onHandlerGotoStore();
            return;
        }
    }

    onHandlerGotoStore() {
        try {
            this.installHandle();
        } catch (error) {
            let linkStore: string = this.getLinkStore();
            window.open(linkStore);
        }
    }
    public installHandle(): void {
        super_html_playable.game_end();
        super_html_playable.download();
    }

    getLinkStore() {
        let mobile = this.getMobileOS();
        switch (mobile) {
            case "android":
                return androidUrl;
            case "iOS":
                return iosUrl;
            default:
                return androidUrl;
        }
    }

    getMobileOS(): string {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/android|Android/i.test(userAgent)) {
            return "android";
        } else if (/iPad|iPhone|iPod|Macintosh/.test(userAgent) && !(window as any).MSStream) {
            return "iOS";
        }
        return "unknown";
    }
}


