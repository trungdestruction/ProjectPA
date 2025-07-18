import { _decorator, color, Component, EPhysics2DDrawFlags, instantiate, Label, Node, NodePool, PhysicsSystem2D, Prefab, Sprite, tween, v3, Vec3 } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import globalEvent from './GlobalEvent';
import { Player } from '../Player';
const { ccclass, property } = _decorator;

// IZ
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.zombie";
// const iosUrl = "https://apps.apple.com/us/app/idle-zombie-survival-station/id6738769059";
// IA
// const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.idle.army";
// const iosUrl = "https://apps.apple.com/us/app/idle-army-trading-weapons/id6670773625";
// IGV
const androidUrl = "https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife";
const iosUrl = "https://apps.apple.com/us/app/idle-goblin-valley/id6737018253";

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Label)
    textMoney: Label = null;

    @property(Node)
    player: Node = null;

    @property(Prefab)
    coin: Prefab = null;

    @property(Node)
    tuto1: Node = null;

    @property(Node)
    tuto2: Node = null;

    @property(Node)
    tuto3: Node = null;

    @property(Node)
    tuto4: Node = null;

    @property(Node)
    tuto5: Node = null;

    @property(Node)
    endCard: Node = null;

    @property(Node)
    house: Node = null;

    @property(Node)
    unlockHouse2: Node = null;

    playerComponent: Player = null;
    doneTuto1: boolean = false;
    doneTuto2: boolean = false;
    doneTuto3: boolean = false;
    doneTuto4: boolean = false;
    money: number = 0;
    currentMoney: number = 0;
    speed: number = 1;
    countStep: number = 0;

    private static _instance: GameManager = null;
    public static getInstance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;

        (window as any).gameReady && (window as any).gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.unimob.goblin.idlelife");
        super_html_playable.set_app_store_url("https://apps.apple.com/us/app/idle-goblin-valley/id6737018253");

        PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags =
        //     EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.Shape;
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
        this.playerComponent = this.player.getComponent(Player);
        this.playerComponent.currentTut = this.tuto1;
    }

    protected update(dt: number): void {
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
        globalEvent.emit("update_money", this.money);
        if (this.house.active && this.money >= 300) {
            this.house.children[0].children[1].children.forEach(child => {
                child.getComponent(Sprite).color = color(0, 167, 14);
                this.player.getComponent(Player).tutoWorker();
            });
        }
        if (this.unlockHouse2.active && this.money >= 300) {
            this.unlockHouse2.children[1].children.forEach(child => {
                child.getComponent(Sprite).color = color(0, 167, 14);
                this.player.getComponent(Player).tutoHouse2();
            });
        }
    }

    spawnMoney(pos: Vec3) {
        let total = Math.floor(Math.random() * 5 + 10);
        for (let i = 0; i < total; i++) {
            let ranX = Math.floor(Math.random() * 200 + pos.x - 100);
            let ranY = Math.floor(Math.random() * 200 + pos.y - 100);
            let delay = Math.random() * 0.3;
            let coin = instantiate(this.coin);
            coin.parent = this.node;
            coin.worldPosition = new Vec3(ranX, ranY, 0);
            coin.scale = v3(0.01, 0.01, 0.01);
            tween(coin)
                .delay(delay)
                .to(0.1, { scale: v3(0.4, 0.4, 0.4) })
                .delay(0.5 - delay)
                .call(() => {
                    let oldPos = coin.worldPosition;
                    coin.parent = this.player;
                    coin.worldPosition = oldPos;
                })
                .to(0.2, { position: Vec3.ZERO })
                .call(() => {
                    coin.destroy();
                })
                .start();
        }
    }

    showTuto2() {
        // if (this.doneTuto1) return;
        this.doneTuto1 = true;
        this.tuto1.active = false;
        this.tuto2.active = true;
        this.playerComponent.currentTut = this.tuto2;
    }

    showTuto3() {
        // if (this.doneTuto2) return;
        this.doneTuto2 = true;
        this.tuto2.active = false;
        this.tuto3.active = true;
        this.tuto4.active = false;
        this.tuto5.active = false;
        this.playerComponent.currentTut = this.tuto3;

    }

    showTuto4() {
        // if (this.doneTuto3) return;
        this.doneTuto3 = true;
        this.tuto3.active = false;
        this.tuto4.active = true;
        this.tuto5.active = true;
        this.playerComponent.currentTut = this.tuto4;

    }

    showTuto1() {
        this.doneTuto4 = true;
        this.tuto4.active = false;
        this.tuto5.active = false;
        switch (this.countStep) {
            case 0:
                this.tuto1.active = true;
                this.playerComponent.currentTut = this.tuto1;
                this.countStep += 1;
                break;
            case 1:
                this.playerComponent.currentTut = this.tuto1;
                this.playerComponent.unlockRoll();
                this.countStep += 1;
                break;
            default:
                break;
        }
    }
}


