import { _decorator, Component, Label, Node, NodePool, tween, Animation, Button, Sprite, Vec4, Vec3 } from 'cc';
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

@ccclass('GameManager')
export class GameManager extends Component {
    // @property(Label)
    // textMoney: Label = null;

    @property(Node)
    btnUpgrade: Node = null;

    @property(Node)
    line: Node[] = []

    @property(Node)
    vfx: Node[] = [];

    countClick: number = 0;
    speed: number = 1;
    countTime: number = 0;

    // money: number = 50;
    // currentMoney: number = 0;



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

    // protected start(): void {
    //     this.currentMoney = this.money;
    //     this.textMoney.string = this.money.toString();
    // }

    // protected update(dt: number): void {
    //     if (this.currentMoney < this.money) {
    //         this.currentMoney += 1;
    //         this.textMoney.string = this.currentMoney.toString();
    //     }
    //     if (this.currentMoney > this.money) {
    //         this.currentMoney -= 5;
    //         this.textMoney.string = this.currentMoney.toString();
    //     }
    // }

    protected start(): void {
        // this.showUpgradeSchedule();
    }

    protected update(dt: number): void {
        this.countTime += dt;
        if (this.countTime >= 2) {
            this.btnUpgrade.children[1].active = true;
        }
    }

    showUpgradeSchedule() {
        this.hideUpgrade();
        this.scheduleOnce(() => {
            this.showUpgrade();
        }, 2)
    }

    showUpgrade() {
        this.btnUpgrade.children[0].getComponent(Button).interactable = true;
        this.btnUpgrade.children[0].getComponent(Animation).play('ZoomInOut');
        this.btnUpgrade.children[0].children[0].getComponent(Sprite).grayscale = false;
        this.btnUpgrade.children[1].active = true;
    }

    hideUpgrade() {
        this.btnUpgrade.children[0].getComponent(Button).interactable = false;
        this.btnUpgrade.children[0].getComponent(Animation).stop();
        this.btnUpgrade.children[0].scale = Vec3.ONE;
        this.btnUpgrade.children[0].children[0].getComponent(Sprite).grayscale = true;
        this.btnUpgrade.children[1].active = false;
    }

    // click() {
    //     switch (this.countClick) {
    //         case 0:
    //             this.speed += 0.5;

    //             break;

    //         case 1:
    //             this.speed += 0.5;

    //             break;

    //         case 2:
    //             this.speed += 0.5;

    //             break;

    //         case 3:
    //             this.line.forEach(element => {
    //                 element.active = true;
    //             });

    //             break;

    //         default:
    //             this.onHandlerGotoStore();

    //             break;
    //     }
    //     this.countClick += 1;
    //     AudioManager.getInstance().playSoundUpgade();
    //     this.vfx.forEach(upgrade => {
    //         upgrade.getComponent(Animation).play('Upgrade');
    //     });
    //     this.showUpgradeSchedule();
    // }

    click() {
        this.speed += 0.3;
        this.countTime = 0;
        this.countClick += 1;
        this.btnUpgrade.children[1].active = false;
        AudioManager.getInstance().playSoundUpgade();
        this.vfx.forEach(upgrade => {
            upgrade.getComponent(Animation).play('Upgrade');
        });
        if (this.countClick == 4) {
            this.line.forEach(element => {
                element.active = true;
            });
        }
        if(this.countClick >= 10){
            this.onHandlerGotoStore();
        }
    }
}


