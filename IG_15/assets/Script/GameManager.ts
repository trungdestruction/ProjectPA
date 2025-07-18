import { _decorator, Color, Component, Label, Node, Animation, screen, view } from 'cc';
import super_html_playable from './src/super_html/super_html_playable';
import { Worker } from './Worker';
import { CustomerZone } from './CustomerZone';
import { ChoosePrice } from './ChoosePrice';
import { AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife";
const iosUrl = "https://apps.apple.com/us/app/idle-goblin-valley/id6737018253";

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    customer: Node = null;

    @property(Node)
    uiNode: Node = null;

    @property(Node)
    banner: Node = null;

    @property(Label)
    textMoney: Label = null;

    @property(Label)
    textBtnSpeed: Label = null;

    @property(Label)
    textBtnWorker: Label = null;

    @property(Node)
    tutHandSpeed: Node = null;

    @property(Node)
    tutHandWorker: Node = null;

    @property([Node])
    vfxUpgrade: Node[] = [];

    @property(Node)
    workZone1: Node = null;

    @property(Node)
    workZone2: Node = null;

    @property(Node)
    workZone3: Node = null;

    @property(Node)
    workZone4: Node = null;

    @property(Node)
    serve: Node = null;

    @property(Node)
    customerZone: Node = null;

    @property(Label)
    priceLabel: Label = null;

    money: number = 0;
    currentMoney: number = 0;
    btnSpeedPrice: number = 5;
    btnWorkerPrice: number = 15;
    price: number = 0;

    tutSpeed: boolean = false;
    tutWorker: boolean = false;

    speed: number = 1;
    countStore: number = 0;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/idle-goblin-valley/id6737018253");
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
    }

    startGame() {
        AudioManager.getInstance().playSoundClick();
        this.price = this.banner.getComponentInChildren(ChoosePrice).price;
        this.priceLabel.string = '+' + this.price;
        this.uiNode.active = true;
        this.banner.active = false;
        this.customerZone.getComponent(CustomerZone).startGame();
        this.scheduleOnce(() => {
            this.workZone1.getComponent(Worker).work();
        }, 2)
    }

    protected update(dt: number): void {
        if (this.currentMoney < this.money) {
            this.currentMoney += 1;
            this.textMoney.string = this.currentMoney.toString();
        }
        if (this.currentMoney > this.money) {
            this.currentMoney -= 1;
            this.textMoney.string = this.currentMoney.toString();
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
                this.tutHandWorker.active = true;
            }
        }
        else {
            this.textBtnWorker.color = new Color(255, 0, 0);
        }
    }

    btnSpeedClick() {
        if (this.money < this.btnSpeedPrice) return;
        this.tutHandSpeed.active = false;
        this.tutHandWorker.active = false;
        this.toStore();
        this.updateMoney(-this.btnSpeedPrice);
        AudioManager.getInstance().playSoundUpgade();
        // this.btnSpeedPrice += 10;
        this.speed += 0.5;
        this.vfxUpgrade.forEach(node => {
            node.getComponent(Animation).play('Upgrade');
        });
    }

    btnWorkerClick() {
        if (this.money < this.btnWorkerPrice) return;
        this.tutHandSpeed.active = false;
        this.tutHandWorker.active = false;
        this.toStore();
        this.updateMoney(-this.btnWorkerPrice);
        AudioManager.getInstance().playSoundUpgade();

        if (this.btnWorkerPrice == 15) {
            this.btnWorkerPrice = 50;
            this.textBtnWorker.string = this.btnWorkerPrice.toString();
            this.workZone2.active = true;
            this.workZone2.getComponentInChildren(Worker).work();
        }
        else if (this.btnWorkerPrice == 50) {
            this.btnWorkerPrice = 100;
            this.textBtnWorker.string = this.btnWorkerPrice.toString();
            this.workZone3.active = true;
            this.workZone3.getComponentInChildren(Worker).work();
        }
        else {
            this.btnWorkerPrice = 200;
            this.textBtnWorker.string = this.btnWorkerPrice.toString();
            this.workZone4.active = true;
            this.workZone4.getComponentInChildren(Worker).work();
        }
    }

    toStore() {
        this.countStore += 1;
        if (this.countStore >= 10) {
            this.onHandlerGotoStore();
            return;
        }
    }
}


