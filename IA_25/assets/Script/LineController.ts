import { _decorator, Component, instantiate, Node, Prefab, tween, Vec2, Vec3 } from 'cc';
import { Solider } from './Constant/Solider';
const { ccclass, property } = _decorator;

@ccclass('LineController')
export class LineController extends Component {
    @property(Node)
    bulletSpawn: Node = null;

    @property(Prefab)
    bullet: Prefab = null;

    @property(Node)
    worker: Node = null;

    @property(Node)
    rollP1: Node = null;

    @property(Node)
    rollP2: Node = null;

    @property(Node)
    rollP3: Node = null;

    @property(Node)
    roll: Node = null;

    @property(Node)
    solider: Node = null;

    protected start(): void {
        this.schedule(this.spawnBullet, 0.2);
    }

    spawnBullet() {
        if (this.bulletSpawn.children.length >= 180) return;
        let startPos = new Vec3(-80, 80, 0);
        let endPos = this.queue(this.bulletSpawn.children.length);

        let bullet = instantiate(this.bullet);
        bullet.parent = this.bulletSpawn;
        bullet.position = startPos;

        this.jumpTo(bullet, startPos, endPos, 70, 0.35);
    }

    queue(slot: number): Vec3 {
        const baseX = 0;
        const baseY = 0;

        const colOffset = new Vec2(16, -11);
        const rowOffset = new Vec2(-35, -20);
        const floorOffsetY = 15;

        const col = slot % 6;
        const row = Math.floor((slot % 18) / 6);  // 12 = 3 hàng x 4 cột
        const floor = Math.floor(slot / 18);

        const x = baseX + col * colOffset.x + row * rowOffset.x;
        const y = baseY + col * colOffset.y + row * rowOffset.y + floor * floorOffsetY;

        return new Vec3(x, y, 0);
    }

    jumpTo(node: Node, startPos: Vec3, endPos: Vec3, jumpHeight: number, duration: number) {
        const tempObj = { t: 0 };

        tween(tempObj)
            .to(duration, { t: 1 }, {
                onUpdate: () => {
                    const t = tempObj.t;

                    // X, Z di chuyển tuyến tính
                    const x = startPos.x + (endPos.x - startPos.x) * t;
                    const z = startPos.z + (endPos.z - startPos.z) * t;

                    // Y theo parabol: y = lerp + jumpHeight * 4t(1 - t)
                    const linearY = startPos.y + (endPos.y - startPos.y) * t;
                    const y = linearY + jumpHeight * 4 * t * (1 - t);

                    node.setPosition(new Vec3(x, y, z));
                }
            })
            .start();
    }

    activeRoll() {
        this.worker.active = false;
        this.roll.active = true;
        this.schedule(this.bulletRoll, 0.15);
    }

    bulletRoll() {
        let bullet = instantiate(this.bullet);
        bullet.parent = this.roll;
        bullet.scale = new Vec3(0.4, 0.4, 0.4);
        bullet.position = new Vec3(-110, 70, 0);
        let timeJump = 0.3;
        this.jumpTo(bullet, bullet.position, this.rollP1.position, 20, timeJump);
        tween(bullet)
            .delay(timeJump)
            .to(1, { position: this.rollP2.position })
            .call(() => {
                this.jumpTo(bullet, bullet.position, this.rollP3.position, 30, timeJump)
            })
            .delay(timeJump + 0.1)
            .call(() => {
                this.solider.getComponent(Solider).updateBullet(1);
                bullet.destroy();
            })
            .start();
    }
}


