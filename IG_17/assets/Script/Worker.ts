import { _decorator, Component, Node, tween, Vec3, Animation, v3, instantiate, Prefab } from 'cc';
import { WoodHouseController } from './WoodHouseController';
import { TableSword } from './TableSword';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    carry: Node = null;

    @property(Node)
    woodHouse: Node = null;

    @property(Node)
    table: Node = null;

    @property(Prefab)
    swordPrefab = null;

    firstRun: boolean = true;
    anim: Animation = null;
    woodHouseController: WoodHouseController = null;
    pos1: Vec3 = new Vec3(330, 220, 0);
    pos2: Vec3 = new Vec3(370, -125, 0);

    protected start(): void {
        this.woodHouseController = this.woodHouse.getComponent(WoodHouseController);
        this.anim = this.graphic.getComponent(Animation);
        this.anim.play('Idle');
        this.scheduleOnce(this.toWoodHouse, 0.5);
    }

    toWoodHouse() {
        let time = 1;
        this.anim.play('Run');
        if (this.firstRun) {
            this.firstRun = false;
            time = 2;
            this.node.scale = Vec3.ONE;
        }
        else {
            this.node.scale = v3(-1, 1, 1);
        }
        tween(this.node)
            .to(time, { position: this.pos1 })
            .call(() => {
                this.anim.play('Idle');
            })
            .delay(0.5)
            .call(() => {
                this.toTable();
            })
            .start();
        tween(this.node)
            .delay(time)
            .call(() => {
                let delay = 0;
                for (let i = 0; i < 10; i++) {
                    let sword = this.woodHouseController.swordStore.children[this.woodHouseController.swordStore.children.length - 1 - i];
                    tween(sword)
                        .delay(delay)
                        .to(0.02, { scale: v3(0.1, 0.1, 0.1) })
                        .call(() => {
                            sword.destroy();
                            const swordSpawn = instantiate(this.swordPrefab);
                            swordSpawn.parent = this.carry;

                            const yOffset = 15 * this.carry.children.length;
                            swordSpawn.position = new Vec3(0, yOffset, 0);
                        })
                        .start();
                    delay += 0.03;
                }
            })
            .start();
    }

    toTable() {
        let time = 1;
        this.anim.play('Run');
        this.node.scale = Vec3.ONE;
        tween(this.node)
            .to(time, { position: this.pos2 })
            .call(() => {
                this.anim.play('Idle');
            })
            .delay(0.5)
            .call(() => {
                this.table.getComponent(TableSword).isReady = true;
                this.toWoodHouse();
            })
            .start();
        tween(this.node)
            .delay(time)
            .call(() => {
                let delay = 0;
                for (let i = 9; i >= 0; i--) {
                    let sword = this.carry.children[i];
                    tween(sword)
                        .delay(delay)
                        .call(() => {
                            let oldPos = sword.worldPosition;
                            sword.parent = this.table;
                            sword.worldPosition = oldPos;
                            sword.scale = v3(0.8, 0.8, 0.8);
                            sword.eulerAngles = new Vec3(0, 0, 115);
                            let endPos = v3(0, 15 * this.table.children.length, 0);
                            this.jumpTo(sword, sword.position, endPos, 50, 0.2);
                        })
                        .start();
                    delay += 0.03;
                }
            })
            .start();
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

}


