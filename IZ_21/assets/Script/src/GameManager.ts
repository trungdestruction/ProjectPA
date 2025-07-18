import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import globalEvent from './GlobalEvent';
import { ButtonBoat } from '../Button/ButtonBoat';
import { ButtonBase } from './ButtonBase';
import { ButtonBath } from '../Button/ButtonBath';
import { ButtonBridge } from '../Button/ButtonBridge';
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
    @property(Label)
    textMoney: Label = null;

    money: number = 50;
    currentMoney: number = 0;

    @property(Node)
    hover1: Node = null;

    @property(Node)
    hover2: Node = null;

    @property(Node)
    hover3: Node = null;

    @property(Node)
    btnBathTuto: Node = null;

    @property(Node)
    btnBoatTuto: Node = null;

    @property(Node)
    btnBridgeTuto: Node = null;

    @property(Node)
    tutHand: Node = null;

    @property(Node)
    warning: Node = null;

    countStore: number = 0;

    isStartGame: boolean = false;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.idle.zombie");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059");

        globalEvent.on("start_game", this.startGame, this);
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
        this.currentMoney = this.money;
        this.textMoney.string = this.money.toString();
        this.scheduleOnce(() => {
            this.hover1.active = true;
            this.hover1.scale = new Vec3(10, 10, 10);
            tween(this.hover1)
                .to(0.35, { scale: Vec3.ONE })
                .call(() => {
                    this.btnBathTuto.getComponent(ButtonBath).button.enabled = true;
                    this.btnBathTuto.children[1].active = true;
                    this.hover1.children[1].active = true;
                })
                .start();
        }, 1)
    }

    protected update(dt: number): void {
        if (this.currentMoney < this.money) {
            this.currentMoney += 1;
            this.textMoney.string = this.currentMoney.toString();
        }
        if (this.currentMoney > this.money) {
            this.currentMoney -= 5;
            this.textMoney.string = this.currentMoney.toString();
        }
    }

    updateMoney(num: number) {
        this.money += num;
        globalEvent.emit("update_money", this.money);
    }

    clickBtnBath() {
        this.hover1.active = false;
        this.scheduleOnce(() => {
            this.btnBoatTuto.getComponent(ButtonBoat).button.enabled = true;
            this.btnBoatTuto.children[1].active = true;
            this.hover2.active = true;
            this.hover2.scale = new Vec3(10, 10, 10);
            tween(this.hover2)
                .to(0.35, { scale: Vec3.ONE })
                .call(() => {
                    this.hover2.children[1].active = true;
                })
                .start();
        }, 1.5)
    }

    clickBtnBoat() {
        this.hover2.active = false;
        this.scheduleOnce(() => {
            this.btnBridgeTuto.getComponent(ButtonBridge).button.enabled = true;
            this.btnBridgeTuto.children[1].active = true;
            this.hover3.active = true;
            this.hover3.scale = new Vec3(10, 10, 10);
            tween(this.hover3)
                .to(0.35, { scale: Vec3.ONE })
                .call(() => {
                    this.hover3.children[1].active = true;
                })
                .start();
        }, 1)
    }

    clickBtnBridge() {
        this.hover3.active = false;
    }

    showTutHand(pos: Vec3) {
        if (this.isStartGame && !this.tutHand.active) {
            this.tutHand.active = true;
            this.tutHand.worldPosition = pos;
        }
    }

    startGame() {
        this.isStartGame = true;
        this.scheduleOnce(() => {
            this.warning.active = true;
        }, 7);
    }

    clickToStore() {
        this.countStore += 1;
        if (this.countStore >= 8) {
            this.onHandlerGotoStore();
        }
    }
}


