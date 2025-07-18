import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { Customer } from './Customer';
import super_html_playable from './src/super_html/super_html_playable';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;
const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.zombie";
const iosUrl = "https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059";

@ccclass('GameManager')
export class GameManager extends Component {
    @property([SpriteFrame])
    number: [] = [];

    @property(Node)
    currentCus: Node = null;

    @property(Label)
    text: Label = null;

    @property(Node)
    speedBoost: Node = null;

    @property(Node)
    workerBoost: Node = null;

    @property(Node)
    cowboyBoost: Node = null;

    @property(SpriteFrame)
    speedActive: SpriteFrame = null;

    @property(SpriteFrame)
    speedInactive: SpriteFrame = null;

    @property(SpriteFrame)
    workerActive: SpriteFrame = null;

    @property(SpriteFrame)
    workerInactive: SpriteFrame = null;

    @property(SpriteFrame)
    cowboyActive: SpriteFrame = null;

    @property(SpriteFrame)
    cowboyInactive: SpriteFrame = null;

    @property(Node)
    tutHand1: Node = null;

    @property(Node)
    tutHand2: Node = null;

    @property(Node)
    tutHand3: Node = null;

    @property(Node)
    worker2: Node = null;

    @property(Node)
    cowboy2: Node = null;

    speed: number = 2.8;

    money: number = 0;
    currentMoney: number = 0;

    countStore: number = 0;
    firstTuto: boolean = false;


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

    updateMoney(num: number) {
        this.money += num;
        if (this.money >= 5) {
            this.speedBoost.getComponent(Sprite).spriteFrame = this.speedActive;
            if (!this.firstTuto) {
                this.firstTuto = true;
                this.tutHand1.active = true;
            }
        }
        else {
            this.speedBoost.getComponent(Sprite).spriteFrame = this.speedInactive;
        }
        if (this.money >= 25) {
            this.workerBoost.getComponent(Sprite).spriteFrame = this.workerActive;
            this.tutHand2.active = true;
        }
        else {
            this.workerBoost.getComponent(Sprite).spriteFrame = this.workerInactive;
        }
        if (this.money >= 50) {
            this.cowboyBoost.getComponent(Sprite).spriteFrame = this.cowboyActive;
            this.tutHand3.active = true;
        }
        else {
            this.cowboyBoost.getComponent(Sprite).spriteFrame = this.cowboyInactive;
        }
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

    boosterSpeed() {
        if (this.money < 5) return;
        this.tutHand1.active = false;
        this.tutHand2.active = false;
        this.tutHand3.active = false;
        this.updateMoney(-5);
        this.speed += 0.4;
        AudioManager.getInstance().playSoundUpgade();

        tween(this.speedBoost)
            .to(0.1, { scale: new Vec3(1.15, 1.15, 1.15) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
        this.countStore += 1;
        if (this.countStore >= 10) {
            this.onHandlerGotoStore();
        }
    }

    boosterWorker() {
        if (this.money < 25) return;
        this.updateMoney(-25);
        this.tutHand2.active = false;
        this.tutHand3.active = false;
        AudioManager.getInstance().playSoundUpgade();

        tween(this.workerBoost)
            .to(0.1, { scale: new Vec3(1.15, 1.15, 1.15) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
        if (!this.worker2.active) {
            this.worker2.active = true;
        }
        else {
            this.onHandlerGotoStore();
        }
    }

    boosterCowboy() {
        if (this.money < 50) return;
        this.updateMoney(-50);
        this.tutHand2.active = false;
        this.tutHand3.active = false;
        AudioManager.getInstance().playSoundUpgade();

        tween(this.cowboyBoost)
            .to(0.1, { scale: new Vec3(1.15, 1.15, 1.15) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
        if (!this.cowboy2.active) {
            this.cowboy2.active = true;
        }
        else {
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


