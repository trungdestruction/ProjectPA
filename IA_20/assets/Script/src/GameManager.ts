import { _decorator, Color, Component, instantiate, Label, Node, Prefab, tween, Vec3 } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import { EnemyController } from '../EnemyController';
import { ButtonTower } from '../Button/ButtonTower';
import { ButtonWorker } from '../Button/ButtonWorker';
import { ButtonWall } from '../Button/ButtonWall';
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

    @property(Prefab)
    coinSpawn: Prefab = null;

    @property(Node)
    btnWorker: Node = null;

    @property(Node)
    btnTower: Node = null;

    @property(Node)
    btnWall: Node = null;

    @property(Node)
    tutHandWorker: Node = null;

    @property(Node)
    tutHandTower: Node = null;

    @property(Node)
    tutHandWall: Node = null;

    @property(Prefab)
    vfxRocket: Prefab = null;

    @property(Prefab)
    vfxSplash: Prefab = null;

    btnWorkerPrice: number = 20;
    btnTowerPrice: number = 30;
    btnWallPrice: number = 50;
    money: number = 50;
    currentMoney: number = 0;
    countBtnWorkerClick: number = 0;
    countBtnTowerClick: number = 0;
    countBtnWallClick: number = 0;

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
            this.currentMoney -= 5;
            this.textMoney.string = this.currentMoney.toString();
        }
    }

    updateMoney(num: number) {
        this.money += num;
        this.btnTower.getComponent(ButtonTower).updateMoney(this.money);
        this.btnWorker.getComponent(ButtonWorker).updateMoney(this.money);
        this.btnWall.getComponent(ButtonWall).updateMoney(this.money);
    }

    hideAllTut() {
        this.tutHandWorker.active = false;
        this.tutHandTower.active = false;
        this.tutHandWall.active = false;
    }

    spawnCoin(pos: Vec3) {
        this.updateMoney(10);
        let coin = instantiate(this.coinSpawn);
        coin.parent = this.node;
        coin.worldPosition = pos;
    }
    
    spawnVfxRocket(pos: Vec3) {
        let vfx = instantiate(this.vfxRocket);
        vfx.parent = this.node;
        vfx.worldPosition = pos;
        tween(this.node)
            .delay(0.5)
            .call(() => {
                vfx.destroy();
            })
            .start();
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

    firstClick(){
        this.btnWorker.active = true;
        this.btnWall.active = true;

        this.btnTower.scale = Vec3.ZERO;
        tween(this.btnTower)
            .to(0.3, {scale: Vec3.ONE})
            .start();
        this.btnWorker.scale = Vec3.ZERO;
        tween(this.btnWorker)
            .to(0.3, {scale: Vec3.ONE})
            .call(()=>{
                this.tutHandWorker.active = true;
            })
            .start();
        this.btnWall.scale = Vec3.ZERO;
        tween(this.btnWall)
            .to(0.3, {scale: Vec3.ONE})
            .start();
    }
}


