import { _decorator, Component, EPhysics2DDrawFlags, instantiate, Label, Node, PhysicsSystem2D, Prefab, tween, Vec3 } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import { ButtonBase } from './ButtonBase';
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

    @property(Node)
    btnSolider: Node = null;

    @property(Node)
    btnSpeed: Node = null;

    @property(Node)
    btnWorker: Node = null;

    @property(Prefab)
    splash: Prefab = null;

    @property(Prefab)
    coinSpawn: Prefab = null;

    @property([Node])
    upgradeVfx: Node[] = [];

    money: number = 0;
    currentMoney: number = 0;
    speedSolider: number = 1;
    countClick: number = 0;
    countTime: number = 0;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.idle.zombie");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059");

        // PhysicsSystem2D.instance.enableDebugDraw = true;
        // PhysicsSystem2D.instance.debugDrawFlags =
        //     EPhysics2DDrawFlags.Shape |
        //     EPhysics2DDrawFlags.AABB |
        //     EPhysics2DDrawFlags.Joint;
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
        this.countTime += dt;
        if (this.countTime >= 2 && !this.btnWorker.getComponent(ButtonBase).tutHand.active && !this.btnSolider.getComponent(ButtonBase).tutHand.active) {
            this.btnSpeed.getComponent(ButtonBase).tutHand.active = true;
        }
    }

    updateMoney(num: number) {
        this.money += num;
        this.btnSpeed.getComponent(ButtonBase).updateMoney(this.money);
        this.btnWorker.getComponent(ButtonBase).updateMoney(this.money);
        this.btnSolider.getComponent(ButtonBase).updateMoney(this.money);
    }

    spawnSplash(pos: Vec3) {
        this.spawnCoin(pos);
        this.updateMoney(10);
        let splash = instantiate(this.splash);
        splash.parent = this.node;
        splash.worldPosition = pos;
        this.scheduleOnce(() => {
            splash.destroy();
        }, 0.5);
    }

    spawnCoin(pos: Vec3) {
        let coinSpawn = instantiate(this.coinSpawn);
        coinSpawn.parent = this.node;
        coinSpawn.worldPosition = pos;
    }

    hideAllTut() {
        this.btnSpeed.getComponent(ButtonBase).tutHand.active = false;
        this.btnWorker.getComponent(ButtonBase).tutHand.active = false;
        this.btnSolider.getComponent(ButtonBase).tutHand.active = false;
        this.countTime = 0;
    }

    countStore() {
        this.countClick += 1;
        if (this.countClick >= 10) {
            this.onHandlerGotoStore();
        }
    }
}


