import { _decorator, Component, instantiate, Label, Node, NodePool, Prefab, sp, Sprite, tween, Vec3 } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import { RowController } from '../RowController';
import { BoatController } from '../BoatController';
import { Attacker } from '../Attacker';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

// IZ
const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.zombie";
const iosUrl = "https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059";
// IA
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.army";
// const iosUrl = "https://apps.apple.com/us/app/idle-army-trading-weapons/id6670773625";
// IGV
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife";
// const iosUrl = "https://apps.apple.com/us/app/idle-goblin-valley/id6737018253";

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    row: Node[] = [];

    @property(Node)
    p1: Node = null;

    @property(Node)
    p2: Node = null;

    @property(Label)
    textMoney: Label = null;

    @property(Prefab)
    vfxCoin: Prefab = null;

    @property(Prefab)
    splashVfx: Prefab = null;

    @property(Node)
    moneyEnd: Node = null;

    @property(Node)
    btn1: Node = null;

    @property(Node)
    tutHandBtn1: Node = null;

    @property(Node)
    btn2: Node = null;

    @property([Node])
    attacker: Node[] = [];

    @property(Node)
    tutHandBtn2: Node = null;

    @property(Node)
    btn3: Node = null;

    @property(Node)
    boatUpgrade: Node = null;

    @property(Node)
    tutHandBtn3: Node = null;

    countTime: number = 0;
    tutActive: boolean = false;

    labelBtn1: Label = null;
    maxSlot: number = 0;
    activeBtn1: boolean = false;
    countRow: number = 0;
    countSlot: number = 0;

    labelBtn2: Label = null;
    activeBtn2: boolean = false;
    btn2Price: number = 50;
    countBtn2Click: number = 0;

    labelBtn3: Label = null;
    activeBtn3: boolean = false;
    btn3Price: number = 50;
    countBtn3Click: number = 0;

    money: number = 0;
    currentMoney: number = 0;
    countBoat: number = 0;
    firstClick: boolean = false;
    tut2: boolean = false;
    tut3: boolean = false;

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

    protected start(): void {
        this.labelBtn1 = this.btn1.getComponentInChildren(Label);
        this.labelBtn2 = this.btn2.getComponentInChildren(Label);
        this.labelBtn3 = this.btn3.getComponentInChildren(Label);
    }

    protected update(dt: number): void {
        if (!this.tutHandBtn1.active) {
            this.countTime += dt;
            if (this.countTime >= 3) {
                if (this.tutHandBtn2.active || this.tutHandBtn3.active) return;
                this.tutHandBtn1.active = true;
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

    updateMoney(num: number) {
        this.money += num;
        if (this.money >= this.btn2Price) {
            this.setSpriteActive(this.btn2);
            this.activeBtn2 = true;
            if (!this.tut2) {
                this.tutHandBtn2.active = true;
            }
        }
        else {
            this.setSpriteInActive(this.btn2);
            this.activeBtn2 = false;
        }
        if (this.money >= this.btn3Price) {
            this.setSpriteActive(this.btn3);
            this.activeBtn3 = true;
            if (!this.tut3) {
                this.tutHandBtn3.active = true;
            }
        }
        else {
            this.setSpriteInActive(this.btn3);
            this.activeBtn3 = false;
        }
    }

    toBoat() {
        if (!this.activeBtn1) return;
        if (this.countBoat == 2 && this.countSlot == this.maxSlot - 1) {
            this.onHandlerGotoStore();
            return;
        }
        AudioManager.getInstance().playSoundClick();
        this.hideAllTut();
        this.countTime = 0;
        if (this.countRow == 0) {
            this.countRow = 1;
        }
        else {
            this.countRow = 0;
        }
        this.row[this.countRow].getComponent(RowController).toBoat(BoatController.getInstance().endPos());

        this.countSlot += 1;
        this.labelBtn1.string = this.countSlot + '/' + this.maxSlot;
        if (this.countSlot == this.maxSlot) {
            this.countBoat += 1;
            this.activeBtn1 = false;
            this.setSpriteBtn1();
            BoatController.getInstance().isFull();
        }
    }

    btn2Click() {
        if (!this.activeBtn2) return;
        this.tut2 = true;
        this.hideAllTut();
        if (this.countBtn2Click == 0) {
            this.countBtn2Click = 1;
            this.updateMoney(-this.btn2Price);
            this.attacker.forEach(element => {
                element.active = true;
            });
            this.btn2Price = 100;
            this.labelBtn2.string = this.btn2Price.toString();
            this.updateMoney(0);
        }
        else if (this.countBtn2Click == 1) {
            this.countBtn2Click = 2;
            this.updateMoney(-this.btn2Price);
            this.attacker.forEach(element => {
                element.getComponent(Attacker).upgrade.active = true;
                element.getComponent(Attacker).reload = 0.5;
            });
            // this.btn2Price = 300;
            this.labelBtn2.string = this.btn2Price.toString();
            this.updateMoney(0);
        }
        else {
            this.onHandlerGotoStore();
        }
        AudioManager.getInstance().playSoundUpgade();
    }

    btn3Click() {
        if (!this.activeBtn3) return;
        this.tut3 = true;
        this.hideAllTut();
        if (this.countBtn3Click == 0) {
            this.countBtn3Click = 1;
            this.updateMoney(-this.btn3Price);
            BoatController.getInstance().upgradeBoat();
            this.boatUpgrade.active = true;
            this.btn3Price = 200;
            this.labelBtn3.string = this.btn3Price.toString();
            this.updateMoney(0);
        }
        else {
            this.onHandlerGotoStore();
        }
        AudioManager.getInstance().playSoundUpgade();
    }

    hideAllTut() {
        this.tutHandBtn1.active = false;
        this.tutHandBtn2.active = false;
        this.tutHandBtn3.active = false;
        this.countTime = 0;
    }

    setSpriteBtn1() {
        let sp1 = this.btn1.getComponent(Sprite);
        let sp2 = this.btn1.getComponentInChildren(Sprite);
        if (!this.activeBtn1) {
            sp1.grayscale = true;
            sp2.grayscale = true;
        }
        else {
            sp1.grayscale = false;
            sp2.grayscale = false;
        }
    }

    setSpriteActive(btn: Node) {
        btn.getComponent(Sprite).grayscale = false;
        btn.getComponentInChildren(Sprite).grayscale = false;
    }

    setSpriteInActive(btn: Node) {
        btn.getComponent(Sprite).grayscale = true;
        btn.getComponentInChildren(Sprite).grayscale = true;
    }


    setMaxLabelBtn1(max: number) {
        this.countSlot = 0;
        this.maxSlot = max;
        this.labelBtn1.string = this.countSlot + '/' + this.maxSlot;
    }

    spawnVfxCoin() {
        let ran = Math.floor(Math.random() * 5 + 10);
        let delay = 0;
        let endPos = this.node.inverseTransformPoint(new Vec3(), this.moneyEnd.worldPosition);
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
                        .to(0.1, { scale: new Vec3(0.8, 0.8, 0.8) })
                        .delay(delay)
                        .to(0.5, { position: endPos, scale: new Vec3(1.2, 1.2, 1.2) })
                        .call(() => {
                            coin.destroy();
                        })
                        .start();
                })
                .start();

            delay += 0.02;
        }
    }
}


