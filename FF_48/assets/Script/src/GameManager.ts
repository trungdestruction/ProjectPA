import { _decorator, Component, Label, Node, Animation, Vec3, tween } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

// IZ
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.zombie";
// const iosUrl = "https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059";
// IA
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.army";
// const iosUrl = "https://apps.apple.com/us/app/idle-army-trading-weapons/id6670773625";
// IGV
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife";
// const iosUrl = "https://apps.apple.com/us/app/idle-goblin-valley/id6737018253";
//FF
const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.foodfever";
const iosUrl = "https://apps.apple.com/us/app/food-fever-restaurant-tycoon/id6447154983";
//FFCFD6 AEE0F0 8DC089 FFFF8B FF5050

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Label)
    textMoney: Label = null;

    @property(Number)
    money: number = 50;

    @property(Number)
    speedChef: number = 500;

    @property(Node)
    hover: Node = null;

    @property(Node)
    chef: Node[] = [];

    @property(Node)
    tutHand: Node = null;

    @property(Node)
    chefBtn: Node = null;

    cus1: Node = null;
    cus2: Node = null;
    cus3: Node = null;
    currentMoney: number = 0;
    countTime: number = 0;
    isStart: boolean = false;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.foodfever");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/food-fever-restaurant-tycoon/id6447154983");
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
        this.hover.active = true;
    }

    protected update(dt: number): void {
        if (!this.isStart) return;
        this.countTime += dt;
        if (this.countTime >= 2) {
            this.tutHand.active = true;
        }
    }

    startGame() {
        AudioManager.getInstance().playSoundClick();
        this.hover.active = false;
    }

    hideTutHand() {
        this.tutHand.active = false;
        this.countTime = 0;
    }

    click(pos: Node) {
        this.hideTutHand();
        let anim = this.chefBtn.getComponentInChildren(Animation);
        anim.play('MoveUp');
        if (this.chefBtn.position.x > pos.position.x) {
            this.chefBtn.scale = new Vec3(-1, 1, 1);
        }
        else {
            this.chefBtn.scale = Vec3.ONE;
        }
        tween(this.chefBtn)
            .to(0.4, { position: pos.position })
            .call(() => {
                anim.play('MoveDown');
                if (this.chefBtn.position.x > 0) {
                    this.chefBtn.scale = new Vec3(-1, 1, 1);
                }
                else {
                    this.chefBtn.scale = Vec3.ONE;
                }
            })
            .to(0.4, { position: new Vec3(0, -1200, 0) })
            .call(() => {
                this.chefBtn.scale = Vec3.ONE;
                anim.play('Idle');
            })
            .start();
    }
}


