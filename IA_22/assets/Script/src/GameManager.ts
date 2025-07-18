import { _decorator, Component, easing, instantiate, Label, Node, NodePool, Prefab, tween, Vec3 } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import { EnemyController } from '../EnemyController';
import { ButtonBase } from '../ButtonBase';
import { Worker } from '../Worker';

const { ccclass, property } = _decorator;

// IZ
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.zombie";
// const iosUrl = "https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059";
// IA
const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.army";
const iosUrl = "https://apps.apple.com/us/app/idle-army-trading-weapons/id6670773625";
// IGV
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife";
// const iosUrl = "https://apps.apple.com/us/app/idle-goblin-valley/id6737018253";

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Label)
    textMoney: Label = null;

    @property(Node)
    btnWall: Node = null;

    @property(Node)
    btnSpeed: Node = null;

    @property(Node)
    btnWorker: Node = null;

    @property(Node)
    btnSolider: Node = null;

    @property(Node)
    wall: Node = null;

    @property(Node)
    barricade: Node = null;

    @property(Prefab)
    vfxSplash: Prefab = null;

    @property(Prefab)
    coinSpawn: Prefab = null;

    @property(Prefab)
    coinSpawn2: Prefab = null;

    speed: number = 0.75 / 1.2;
    money: number = 50;
    currentMoney: number = 0;
    countClick: number = 0;

    worker: Node[] = [];


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
            this.currentMoney -= 1;
            this.textMoney.string = this.currentMoney.toString();
        }
    }

    updateMoney(num: number) {
        this.money += num;
        this.btnSpeed.getComponent(ButtonBase).updateMoney(this.money);
        this.btnWorker.getComponent(ButtonBase).updateMoney(this.money);
        this.btnSolider.getComponent(ButtonBase).updateMoney(this.money);
    }

    activeWall() {
        this.updateMoney(-30);
        this.barricade.active = false;
        this.btnWall.active = false;
        this.btnSolider.active = true;
        this.btnSpeed.active = true;
        this.btnWorker.active = true;
        let delay = 0;
        for (let i = 0; i < this.wall.children.length; i++) {
            tween(this.node)
                .delay(delay)
                .call(() => {
                    let wall = this.wall.children[i];
                    wall.active = true;
                    wall.children[1].position = new Vec3(0, 100, 0);
                    tween(wall.children[1])
                        .to(1, { position: Vec3.ZERO }, { easing: easing.bounceOut })
                        .start();
                })
                .start();
            delay += 0.13;
        }
    }

    spawnVfxSplash(pos: Vec3) {
        let vfx = instantiate(this.vfxSplash);
        vfx.parent = this.node;
        vfx.worldPosition = pos;
        tween(this.node)
            .delay(0.5)
            .call(() => {
                vfx.destroy();
            })
            .start();
    }

    spawnCoin(pos: Vec3) {
        this.updateMoney(10);
        let coin = instantiate(this.coinSpawn);
        coin.parent = this.node;
        coin.worldPosition = pos;
    }

    spawnCoin2(pos: Vec3) {
        this.updateMoney(100);
        let coin = instantiate(this.coinSpawn2);
        coin.parent = this.node;
        coin.worldPosition = pos;
    }

    order(solider: Node) {
        if (this.worker.length == 0) return;
        let orderSuccess = false;
        for (let i = 0; i < this.worker.length; i++) {
            let worker = this.worker[i].getComponent(Worker);
            if (!worker.isInOrder) {
                orderSuccess = true;
                worker.order(solider);
                return;
            }
        }
        // if (!orderSuccess) {
        //     let worker = this.worker[0].getComponent(Worker);
        //     worker.soliderOrderQueue = solider;
        // }
    }

    hideAllTut() {
        this.btnSpeed.getComponent(ButtonBase).tutHand.active = false;
        this.btnWorker.getComponent(ButtonBase).tutHand.active = false;
        this.btnSolider.getComponent(ButtonBase).tutHand.active = false;
    }

    countStore() {
        this.countClick += 1;
        if (this.countClick >= 6) {
            this.onHandlerGotoStore();
        }
    }
}


