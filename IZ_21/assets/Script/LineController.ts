import { _decorator, Component, instantiate, Node, Prefab, Sprite, Tween, tween, Vec3, Animation } from 'cc';
import { BoatController } from './BoatController';
import globalEvent from './src/GlobalEvent';
import { Character } from './Character';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('LineController')
export class LineController extends Component {
    @property(Prefab)
    char: Prefab[] = [];

    @property(Node)
    toiletWaiting: Node = null;

    @property(Node)
    bathroom: Node = null;

    @property(Node)
    boatWaiting: Node = null;

    @property(Node)
    progress: Node = null;

    @property(Sprite)
    spriteProgress: Sprite = null;

    @property(Node)
    boatControllerNode: Node = null;

    @property(Boolean)
    firstLine: boolean = false;

    @property(Node)
    bath: Node = null;

    @property(Node)
    btnBath: Node = null;

    @property(Node)
    bridge: Node = null;

    @property(Node)
    btnBridge: Node = null;

    @property(Node)
    smoke: Node = null;

    @property(Animation)
    vfxCoin: Animation = null;

    boatController: BoatController = null;
    isBathing: boolean = true;
    isActiveBridge: boolean = false;

    protected onLoad(): void {
        globalEvent.on("spawn", this.spawn, this);
    }

    protected start(): void {
        this.boatController = this.boatControllerNode.getComponent(BoatController);
        if (this.firstLine) {
            this.firstSpawn();
        }
    }

    firstSpawn() {
        this.spawnChar(800);
        this.spawnChar(800);
        this.spawnChar(800);
        this.spawnChar(800);
        this.spawnChar(800);
    }

    spawn() {
        if (!this.firstLine) {
            this.firstSpawn();
        }
    }

    spawnChar(distance: number) {
        let charSpawn = instantiate(this.char[Math.floor(Math.random() * this.char.length)]);
        charSpawn.parent = this.toiletWaiting;
        charSpawn.setSiblingIndex(0);
        this.scheduleOnce(() => {
            charSpawn.getComponent(Character).showPopUpCau();
        }, this.randomFloat(3, 7))
        let posY = 100 * (this.toiletWaiting.children.length - 1);
        charSpawn.position = new Vec3(0, distance + posY, 0);
        tween(charSpawn)
            .to(distance / 800, { position: new Vec3(0, posY, 0) })
            .start();
    }

    bathing() {
        this.isBathing = true;
        let char = this.toiletWaiting.children[this.toiletWaiting.children.length - 1];
        char.parent = this.bathroom;
        char.position = new Vec3(0, 150, 0);
        tween(char)
            .to(0.3, { position: Vec3.ZERO })
            .call(() => {
                this.progress.active = true;
                char.active = false;
                this.spriteProgress.fillRange = 0;
                this.smoke.active = true;
                tween(this.spriteProgress)
                    .to(0.7, { fillRange: 1 })
                    .call(() => {
                        this.progress.active = false;
                        this.vfxCoin.play('Coin');
                        GameManager.getInstance().updateMoney(10);
                        this.smoke.active = false;
                        char.active = true;
                        char.parent = this.boatWaiting;
                        char.getComponent(Character).showPopUpVui();
                        char.setSiblingIndex(0);
                        char.position = new Vec3(0, 300, 0);
                        let posY = 100 * (this.boatWaiting.children.length - 1);
                        tween(char)
                            .to((300 - posY) / 500, { position: new Vec3(0, posY, 0) })
                            .call(() => {
                                this.goToBoat();
                            })
                            .start();

                        if (this.boatWaiting.children.length < 3) {
                            this.bathing();
                        }
                        else {
                            this.isBathing = false;
                        }
                    })
                    .start();
            })
            .start();
        this.toiletWaiting.children.forEach(child => {
            tween(child)
                .to(0.2, { position: new Vec3(0, child.position.y - 100, 0) })
                .start();
        });
        this.scheduleOnce(() => {
            this.spawnChar(100);
        }, 0.2);
    }

    goToBoat() {
        if (!this.boatController.isActive || this.boatWaiting.children.length == 0 || !this.isActiveBridge) return;
        let char = this.boatWaiting.children[this.boatWaiting.children.length - 1];
        let oldPos = char.worldPosition;
        char.parent = this.boatController.getSlot();
        char.worldPosition = oldPos;
        tween(char)
            .to(0.6, { position: new Vec3(char.position.x, char.position.y - 300, 0) })
            .to(0.4, { position: Vec3.ZERO })
            .start();
        this.boatWaiting.children.forEach(child => {
            tween(child)
                .to(0.2, { position: new Vec3(0, child.position.y - 100, 0) })
                .start();
        });
        tween(this.node)
            .delay(0.3)
            .call(() => {
                this.goToBoat();
            })
            .start();
        if (!this.isBathing) {
            this.bathing();
        }
    }

    unlockBath() {
        this.bath.active = true;
        this.bathing();
        this.btnBath.active = false;
    }

    unlockBridge() {
        this.bridge.active = true;
        this.isActiveBridge = true;
        tween(this.node)
            .delay(0.3)
            .call(() => {
                this.goToBoat();
            })
            .start();
        if (this.firstLine) {
            globalEvent.emit("spawn");
            globalEvent.emit("start_game");
        }
        this.btnBridge.active = false;
    }

    randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}