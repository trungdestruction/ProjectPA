import { _decorator, Component, Node, Animation, SpriteFrame, Sprite, Vec2, Vec3, tween } from 'cc';
import { LineController } from '../LineController';
import { Solider } from './Solider';
import { GameManager } from '../src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Node)
    carry: Node = null;

    @property(Node)
    carry2: Node = null;

    @property(SpriteFrame)
    stay: SpriteFrame = null;

    @property(SpriteFrame)
    stay2: SpriteFrame = null;

    @property(Node)
    startPos: Node = null;

    @property(Node)
    endPos: Node = null;

    @property(Node)
    solider: Node = null;

    lineController: LineController = null;
    anim: Animation = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
        this.lineController = this.node.parent.getComponent(LineController);
        this.distance = Vec3.distance(this.startPos.position, this.endPos.position);
    }

    protected start(): void {
        this.takeBullet();
    }

    takeBullet() {
        this.graphic.getComponent(Sprite).spriteFrame = this.stay;
        let bulletSpawn = this.lineController.bulletSpawn;
        let delay = 0;
        for (let i = 0; i < 4; i++) {
            let bullet = bulletSpawn.children[bulletSpawn.children.length - 1];
            let oldPos = bullet.worldPosition;
            bullet.parent = this.carry;
            bullet.worldPosition = oldPos;
            this.JumpTo(bullet, bullet.position, new Vec3(0, 15 * i, 0), 30, 0.3, delay);
            delay += 0.2;
        }
        tween(this.node)
            .delay(0.2 * 4 + 0.15)
            .call(() => {
                this.carrying();
            })
            .start();
    }

    carrying() {
        this.anim.play('Carry30R');
        this.carry.destroyAllChildren();
        this.carry2.children.forEach(child => {
            child.active = true;
        });
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speed, { position: this.endPos.position })
            .call(() => {
                this.serve();
            })
            .start();
    }

    serve() {
        this.anim.stop();
        this.graphic.getComponent(Sprite).spriteFrame = this.stay2;
        let delay = 0;
        for (let i = 4; i >= 0; i--) {
            this.JumpTo(this.carry2.children[i], this.carry2.children[i].position, new Vec3(70, 65, 0), 50, 0.3, delay);
            tween(this.carry2.children[i])
                .delay(delay + 0.3)
                .to(0, { position: new Vec3(0, 15 * i, 0) })
                .call(() => {
                    this.solider.getComponent(Solider).updateBullet(1);
                    this.carry2.children[i].active = false;
                })
                .start();
            delay += 0.2;
        }
        tween(this.node)
            .delay(0.2 * 4 + 0.15)
            .call(() => {
                this.move();
            })
            .start();
    }

    move() {
        this.anim.play('Run130');
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speed, { position: this.startPos.position })
            .call(() => {
                this.anim.stop();
                this.graphic.getComponent(Sprite).spriteFrame = this.stay;
                this.takeBullet();
            })
            .start();
    }

    JumpTo(node: Node, startPos: Vec3, endPos: Vec3, jumpHeight: number, duration: number, delay: number) {
        const tempObj = { t: 0 };

        tween(tempObj)
            .delay(delay)
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


