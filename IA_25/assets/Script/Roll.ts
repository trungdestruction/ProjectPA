import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { SoliderRocket } from './SoliderRocket';
const { ccclass, property } = _decorator;

@ccclass('Roll')
export class Roll extends Component {
    @property(Node)
    p1: Node = null;

    @property(Node)
    p2: Node = null;

    @property(Node)
    p3: Node = null;

    @property(Prefab)
    bullet: Prefab = null;

    @property(Node)
    solider: Node = null;

    protected start(): void {
        this.schedule(this.bulletRoll, 0.6);
    }

    bulletRoll() {
        let bullet = instantiate(this.bullet);
        bullet.parent = this.node;
        bullet.scale = new Vec3(0.16, 0.2, 1);
        bullet.position = new Vec3(-110, 70, 0);
        let timeJump = 0.3;
        this.jumpTo(bullet, bullet.position, this.p1.position, 20, timeJump);
        tween(bullet)
            .delay(timeJump)
            .to(2, { position: this.p2.position })
            .call(() => {
                this.jumpTo(bullet, bullet.position, this.p3.position, 30, timeJump)
            })
            .delay(timeJump + 0.1)
            .call(() => {
                this.solider.getComponent(SoliderRocket).updateBullet(1);
                bullet.destroy();
            })
            .start();
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
}


