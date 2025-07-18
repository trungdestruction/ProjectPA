import { _decorator, Component, Node, Animation, Collider2D, IPhysics2DContact, Contact2DType, Prefab, tween, instantiate, Vec3, v3, Vec2, NodePool, Quat, Game } from 'cc';
import { WoodHouseController } from './WoodHouseController';
import { TableSword } from './TableSword';
import { GameManager } from './src/GameManager';
import { JoyController } from '../scripts/JoyController';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    carry: Node = null;

    @property(Node)
    graphicAll: Node = null;

    @property(Prefab)
    woodPrefab: Prefab = null;

    @property(Prefab)
    swordPrefab: Prefab = null;

    @property(Node)
    woodOutNode: Node = null;

    @property(Node)
    houseOver: Node = null;

    @property(Node)
    tutArrow: Node = null;

    @property(Node)
    camera: Node = null;

    @property(Node)
    btnRoll: Node = null;

    @property(Node)
    woodInNode: Node = null;

    @property(Node)
    hangRao: Node = null;

    @property(Node)
    roll: Node = null;

    @property(JoyController)
    joy: JoyController = null;

    @property(Node)
    house: Node = null;

    @property(Node)
    worker: Node = null;

    @property(Node)
    stoneMine: Node = null;

    @property(Node)
    woodHouse2: Node = null;

    @property(Node)
    unlockRoll2: Node = null;

    currentTut: Node = null;
    anim: Animation = null;
    collider: Collider2D = null;
    carryingWood: boolean = false;
    carryingSword: boolean = false;
    activeCamFollow: boolean = true;

    onLoad() {
        this.anim = this.graphic.getComponent(Animation);
        this.collider = this.node.getComponent(Collider2D);
        // Bắt sự kiện va chạm
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    protected update(dt: number): void {
        if (this.activeCamFollow) {
            this.camera.position = this.node.position;
        }
        if (this.node.position.y > 450) {
            this.houseOver.active = true;
        }
        else {
            this.houseOver.active = false;
        }
        if (this.currentTut) {
            this.rotateNodeTowardsTarget(this.tutArrow, this.currentTut);
        }
    }

    rotateNodeTowardsTarget(source: Node, target: Node) {
        const fromPos = source.getWorldPosition();
        const toPos = target.getWorldPosition();

        // Vector hướng từ source -> target
        const dir = toPos.subtract(fromPos);
        const angleRad = Math.atan2(dir.y, dir.x);
        const angleDeg = angleRad * (180 / Math.PI);

        // Gán angle đơn giản nếu node không xoay lệch hệ quy chiếu
        source.angle = angleDeg;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        if (otherCollider.node.name == 'WoodIn') {
            this.woodIn(otherCollider.node.worldPosition);
        }

        if (otherCollider.node.name == 'WoodOut') {
            this.woodOut();
        }

        if (otherCollider.node.name == 'SwordIn') {
            this.swordIn(otherCollider.node);
        }

        if (otherCollider.node.name == 'Table') {
            this.swordOut(otherCollider.node);
        }

        if (otherCollider.node.name == 'UnlockRoll') {
            GameManager.getInstance().updateMoney(-200);
            this.activeRoll();
        }

        if (otherCollider.node.name == 'AddWorker') {
            if (GameManager.getInstance().money < 300) return;
            GameManager.getInstance().updateMoney(-300);
            this.addWorker(otherCollider.node);
        }

        if (otherCollider.node.name == 'UnlockHouse2') {
            if (GameManager.getInstance().money < 300) return;
            GameManager.getInstance().updateMoney(-300);
            otherCollider.node.active = false;
            this.woodHouse2.active = true;
            this.unlockRoll2.active = true;
            tween(this.node)
                .to(0.4, { position: new Vec3(this.node.position.x + 200, this.node.position.y, 0) })
                .start();
            //EndCard 3
            GameManager.getInstance().endCard.active = true;
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    }

    addWorker(pos: Node) {
        pos.active = false;
        this.tutArrow.active = false;
        this.worker.active = true;
        this.activeCamFollow = false;
        this.joy.canMove = false;
        this.joy.joy.active = false;
        tween(this.camera)
            .to(1, { position: new Vec3(this.stoneMine.position.x * 2, this.stoneMine.position.y * 2, 0) })
            .call(() => {
                this.stoneMine.getComponent(Animation).play('StoneMine');
                AudioManager.getInstance().playSoundUpgade();
            })
            .delay(1.7)
            .to(1, { position: this.node.position })
            .call(() => {
                //EndCard 2
                GameManager.getInstance().endCard.active = true;
                this.activeCamFollow = true;
                this.currentTut = this.btnRoll;
                this.joy.canMove = true;
            })
            .start();
    }

    tutoHouse2() {
        this.tutArrow.active = true;
        this.currentTut = this.woodHouse2;
    }

    tutoWorker() {
        this.tutArrow.active = true;
        this.currentTut = this.house;
        this.house.children[0].children[2].active = true;
    }

    woodIn(pos: Vec3) {
        if (this.carryingWood || this.carryingSword) return;
        GameManager.getInstance().showTuto2();

        this.carryingWood = true;
        let delay = 0;
        for (let i = 0; i < 10; i++) {
            tween(this.node)
                .delay(delay)
                .call(() => {
                    let wood = instantiate(this.woodPrefab);
                    wood.parent = this.carry;
                    wood.worldPosition = pos;
                    let endPos = v3(0, i * 35, 0);
                    this.jumpTo(wood, wood.position, endPos, 50, 0.2);
                    if (i % 3 == 0) {
                        AudioManager.getInstance().playSoundPop();
                    }
                    console.log('sound');
                })
                .start();
            delay += 0.03;
        }
    }

    woodOut() {
        if (this.carryingWood) {
            GameManager.getInstance().showTuto3();

            this.carryingWood = false;
            let delay = 0;
            for (let i = 9; i >= 0; i--) {
                tween(this.node)
                    .delay(delay)
                    .call(() => {
                        let wood = this.carry.children[i];
                        let oldPos = wood.worldPosition;
                        wood.parent = this.woodOutNode;
                        wood.worldPosition = oldPos;
                        wood.eulerAngles = Vec3.ZERO;
                        let endPos = this.queue(this.woodOutNode.children.length - 1);
                        this.jumpTo(wood, wood.position, endPos, 50, 0.2);
                        if (i % 3 == 0) {
                            AudioManager.getInstance().playSoundPop();
                        }
                    })
                    .start()
                delay += 0.03;
            }
            this.scheduleOnce(() => {
                WoodHouseController.getInstance().spawnSword();
            }, 0.35);
        }
    }

    swordIn(swordStore: Node) {
        if (this.carryingWood || this.carryingSword || swordStore.children.length < 10) return;
        // this.tutArrow.active = false;
        GameManager.getInstance().showTuto4();

        this.carryingSword = true;
        let delay = 0;
        for (let i = 0; i < 10; i++) {
            let sword = swordStore.children[swordStore.children.length - 1 - i];
            // let oldPos = sword.worldPosition;
            // sword.parent = this.carry;
            // sword.worldPosition = oldPos;
            tween(sword)
                .delay(delay)
                .to(0.02, { scale: v3(0.1, 0.1, 0.1) })
                .call(() => {
                    sword.destroy();
                    const swordSpawn = instantiate(this.swordPrefab);
                    swordSpawn.parent = this.carry;

                    const yOffset = 15 * this.carry.children.length;
                    swordSpawn.position = new Vec3(0, yOffset, 0);
                    if (i % 3 == 0) {
                        AudioManager.getInstance().playSoundPop();
                    }
                })
                .start();
            delay += 0.03;
        }
    }

    swordOut(table: Node) {
        if (this.carryingSword) {
            // this.tutArrow.active = true;
            if (GameManager.getInstance().countStep >= 2) {
                GameManager.getInstance().showTuto3();
            }
            else {
                GameManager.getInstance().showTuto1();
            }
            this.carryingSword = false;
            let delay = 0;
            for (let i = 9; i >= 0; i--) {
                let sword = this.carry.children[i];
                tween(sword)
                    .delay(delay)
                    .call(() => {
                        let oldPos = sword.worldPosition;
                        sword.parent = table;
                        sword.worldPosition = oldPos;
                        sword.scale = v3(0.8, 0.8, 0.8);
                        sword.eulerAngles = new Vec3(0, 0, 115);
                        let endPos = v3(0, 15 * table.children.length, 0);
                        this.jumpTo(sword, sword.position, endPos, 50, 0.2);
                        if (i % 3 == 0) {
                            AudioManager.getInstance().playSoundPop();
                        }
                    })
                    .start();
                delay += 0.03;
            }
            this.scheduleOnce(() => {
                table.getComponent(TableSword).isReady = true;
            }, 0.35)
        }
    }


    jumpTo(node: Node, startPos: Vec3, endPos: Vec3, jumpHeight: number, duration: number) {
        const tempObj = { t: 0 };

        tween(tempObj)
            .to(duration, { t: 1 }, {
                onUpdate: () => {
                    if (!node || !node.isValid) return;

                    const t = tempObj.t;

                    const x = startPos.x + (endPos.x - startPos.x) * t;
                    const z = startPos.z + (endPos.z - startPos.z) * t;

                    const linearY = startPos.y + (endPos.y - startPos.y) * t;
                    const y = linearY + jumpHeight * 4 * t * (1 - t);

                    node.setPosition(new Vec3(x, y, z));
                }
            })
            .start();
    }

    queue(slot: number): Vec3 {
        const startX = -30;
        const startY = 25;

        const colOffset = new Vec2(28, -15); // mỗi cột cách nhau 28 theo x, -15 theo y
        const floorOffsetY = 30;             // mỗi tầng cách nhau 30 theo y

        const col = slot % 3;                 // 3 cột
        const floor = Math.floor(slot / 3);   // mỗi tầng có 3 slot

        const x = startX + col * colOffset.x;
        const y = startY + col * colOffset.y + floor * floorOffsetY;

        return new Vec3(x, y, 0);
    }

    unlockRoll() {
        this.activeCamFollow = false;
        this.joy.canMove = false;
        this.joy.joy.active = false;
        tween(this.camera)
            .to(0.5, { position: new Vec3(this.btnRoll.position.x * 2, this.btnRoll.position.y * 2, 0) })
            .call(() => {
                this.btnRoll.children[0].active = true;
                this.woodInNode.active = false;
                AudioManager.getInstance().playSoundUpgade();
            })
            .delay(0.8)
            .to(0.5, { position: this.node.position })
            .call(() => {
                this.activeCamFollow = true;
                this.currentTut = this.btnRoll;
                this.joy.canMove = true;
            })
            .start();
    }

    activeRoll() {
        this.btnRoll.active = false;
        this.hangRao.position = v3(-520, -300, 0);
        this.woodOutNode.active = false;
        this.roll.active = true;
        AudioManager.getInstance().playSoundUpgade();
        tween(this.node)
            .delay(0.2)
            .call(() => {
                this.roll.children[1].active = true;
            })
            .delay(0.2)
            .call(() => {
                this.roll.children[2].active = true;
                WoodHouseController.getInstance().autoSpawnSword();
            })
            .start();

        this.activeCamFollow = false;
        this.joy.canMove = false;
        this.joy.joy.active = false;
        // this.tutArrow.active = false;
        this.currentTut = this.house;
        tween(this.camera)
            .delay(0.5)
            .to(0.8, { position: new Vec3(this.house.position.x * 2, this.house.position.y * 2, 0) })
            .call(() => {
                this.house.active = true;
                AudioManager.getInstance().playSoundUpgade();
            })
            .delay(0.8)
            .to(0.8, { position: this.node.position })
            .call(() => {
                this.activeCamFollow = true;
                this.currentTut = this.btnRoll;
                this.joy.canMove = true;
                GameManager.getInstance().showTuto3();

                //EndCard 1
                GameManager.getInstance().endCard.active = true;
            })
            .start();


    }
}