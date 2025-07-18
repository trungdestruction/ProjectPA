import { _decorator, Button, Color, Component, instantiate, Label, Node, NodeEventType, Prefab, tween, Vec3 } from 'cc';
import { SoliderController } from './SoliderController';
import { WorkerController } from './WorkerController';
import { Worker } from './Worker';
import super_html_playable from './src/super_html/super_html_playable';
import { AudioManager } from './AudioManager';
import { BossController } from './BossController';
const { ccclass, property } = _decorator;

const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.army";
const iosUrl = "https://apps.apple.com/us/app/idle-army-trading-weapons/id6670773625";

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    uiNode: Node = null;

    @property(Prefab)
    vfxCoin: Prefab = null;

    @property(Prefab)
    rocketVfxx: Prefab = null;

    @property(Label)
    text: Label = null;

    @property(Node)
    sungCoi: Node = null;

    @property(Node)
    btnSungCoi: Node = null;

    @property(Label)
    textBtnSpeed: Label = null;

    @property(Label)
    textBtnWorker: Label = null;

    @property(Label)
    textBtnSungCoi: Label = null;

    @property(Node)
    tutHandSpeed: Node = null;

    @property(Node)
    tutHandWorker: Node = null;

    @property(Node)
    tutHandSungCoi: Node = null;

    @property(Node)
    iconDanCoi: Node = null;

    @property(Node)
    worker1: Node = null;

    @property(Node)
    worker2: Node = null;

    @property(Node)
    worker3: Node = null;

    @property(Node)
    coinImg: Node = null;

    money: number = 0;
    currentMoney: number = 0;
    tutSpeed: boolean = false;
    tutWorker: boolean = false;
    tutSungCoi: boolean = false;
    btnSpeedPrice: number = 15;
    btnWorkerPrice: number = 50;

    countStore: number = 0;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.idle.army");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/idle-army-trading-weapons/id6670773625");
    }

    start() {

    }

    protected update(dt: number): void {
        if (this.currentMoney < this.money) {
            this.currentMoney += 1;
            this.text.string = this.currentMoney.toString();
        }
        if (this.currentMoney > this.money) {
            this.currentMoney -= 1;
            this.text.string = this.currentMoney.toString();
        }
    }

    updateMoney(num: number) {
        this.money += num;
        if (this.money >= this.btnSpeedPrice) {
            this.textBtnSpeed.color = new Color(255, 255, 255);
            if (!this.tutSpeed) {
                this.tutSpeed = true;
                this.tutHandSpeed.active = true;
            }
        }
        else {
            this.textBtnSpeed.color = new Color(255, 0, 0);
        }
        if (this.money >= this.btnWorkerPrice) {
            this.textBtnWorker.color = new Color(255, 255, 255);
            if (!this.tutWorker && !this.tutHandSpeed.active) {
                // this.tutWorker = true;
                this.tutHandWorker.active = true;
            }
        }
        else {
            this.textBtnWorker.color = new Color(255, 0, 0);
        }
        if (this.money >= 150) {
            this.textBtnSungCoi.color = new Color(255, 255, 255);
            if (!this.tutSungCoi && !this.tutHandSpeed.active && !this.tutHandWorker.active) {
                this.tutSungCoi = true;
                this.tutHandSungCoi.active = true;
            }
        }
        else {
            this.textBtnSungCoi.color = new Color(255, 0, 0);
        }
    }

    spawnVfxCoin(pos: Vec3) {
        let vfx = instantiate(this.vfxCoin);
        vfx.parent = this.uiNode;
        vfx.worldPosition = pos;
        tween(this.node)
            .delay(0.5)
            .call(() => {
                vfx.destroy();
            })
            .start();
    }

    btnSpeedClick() {
        if (this.money < this.btnSpeedPrice) return;
        this.toStore();
        this.updateMoney(-this.btnSpeedPrice);
        this.btnSpeedPrice += 10;
        this.textBtnSpeed.string = this.btnSpeedPrice.toString();
        this.worker1.getComponent(Worker).vfxUpgrade.play('Upgrade');
        this.worker2.getComponent(Worker).vfxUpgrade.play('Upgrade');
        this.worker3.getComponent(Worker).vfxUpgrade.play('Upgrade');
        if (this.money < this.btnSpeedPrice) {
            this.textBtnSpeed.color = new Color(255, 0, 0);
        }
        AudioManager.getInstance().playSoundUpgade();
        WorkerController.getInstance().timeProgress = WorkerController.getInstance().timeProgress * 0.7;
        this.hideTutHand();
    }

    btnWorkerClick() {
        if (this.money < this.btnWorkerPrice) return;
        this.toStore();
        this.updateMoney(-this.btnWorkerPrice);
        if (this.btnWorkerPrice == 50) {
            AudioManager.getInstance().playSoundUpgade();
            BossController.getInstance().attack();
            this.worker2.active = true;
            this.coinImg.position = new Vec3(-65, -115, 0);
            this.btnWorkerPrice = 100;
            this.textBtnWorker.string = this.btnWorkerPrice.toString();
            if (this.money < this.btnWorkerPrice) {
                this.textBtnWorker.color = new Color(255, 0, 0);
            }
        }
        else if (this.btnWorkerPrice == 300) {
            AudioManager.getInstance().playSoundUpgade();
            BossController.getInstance().attack();
            this.worker3.active = true;
            this.btnWorkerPrice = 300;
            this.textBtnWorker.string = this.btnWorkerPrice.toString();
            if (this.money < this.btnWorkerPrice) {
                this.textBtnWorker.color = new Color(255, 0, 0);
            }
        }
        else {
            this.onHandlerGotoStore();
        }
        this.hideTutHand();
    }

    btnSungCoiClick() {
        if (this.money < 150) return;
        this.toStore();
        this.sungCoi.active = true;
        AudioManager.getInstance().playSoundUpgade();
        this.hideTutHand();
        this.iconDanCoi.active = true;
        this.btnSungCoi.active = false;
    }

    hideTutHand() {
        this.tutHandSpeed.active = false;
        this.tutHandWorker.active = false;
        this.tutHandSungCoi.active = false;
    }

    toStore() {
        this.countStore += 1;
        if (this.countStore == 2) {
            BossController.getInstance().attack();
        }
        if (this.countStore >= 7) {
            this.onHandlerGotoStore();
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


