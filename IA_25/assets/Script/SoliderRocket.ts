import { _decorator, Component, Label, Node, Animation, color, Vec3, tween, v2, CircleCollider2D } from 'cc';
import { AudioManager } from './src/AudioManager';
import { EnemyController } from './EnemyController';
import { Enemy } from './Enemy';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('SoliderRocket')
export class SoliderRocket extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Label)
    labelBullet: Label = null;

    @property(Node)
    rocket: Node = null;

    @property(Node)
    enemyZone: Node = null;

    bullet: number = 2;
    shooting: boolean = false;
    anim: Animation = null;
    distance: number = 0;

    onLoad() {
        this.anim = this.graphic.getComponent(Animation);
    }
    protected start(): void {
        this.updateBullet(0);
    }

    updateBullet(num: number) {
        this.bullet += num;
        this.labelBullet.string = this.bullet.toString();

        if (this.bullet > 0) {
            this.labelBullet.color = color(255, 255, 255);

            // Kiểm tra enemyZone để tránh gọi atk() sai lúc
            if (!this.shooting && this.enemyZone.children.length > 0) {
                this.atk();
            }
        } else {
            this.labelBullet.color = color(255, 0, 0);
        }
    }

    atk() {
        if (this.enemyZone.children.length > 0 && this.bullet > 0) {
            if (this.shooting) return;
            this.shooting = true;
            this.updateBullet(-1);
            let duration = 0.8;
            this.anim.play('Atk30');

            this.rocket.active = true;
            this.rocket.getComponent(CircleCollider2D).enabled = false;
            this.rocket.position = Vec3.ZERO;

            let endPos = EnemyController.getInstance().killDanCoi();
            let localPos = this.node.inverseTransformPoint(new Vec3(), endPos.worldPosition);
            this.distance = Vec3.distance(Vec3.ZERO, localPos) / 1000;

            this.jumpTo(this.rocket, Vec3.ZERO, localPos, 200, this.distance);

            tween(this.node)
                .delay(this.distance + 0.5)
                .call(() => {
                    this.shooting = false;
                    this.atk(); // Gọi lại nếu còn enemy
                })
                .start();
        }
        else {
            this.anim.play('Idle30');
            this.shooting = false;
        }
    }

    jumpTo(node: Node, startPos: Vec3, endPos: Vec3, jumpHeight: number, duration: number) {
        const tempObj = { t: 0 };
        let lastPos = startPos.clone();

        tween(tempObj)
            .to(duration, { t: 1 }, {
                onUpdate: () => {
                    const t = tempObj.t;

                    // X di chuyển tuyến tính (2D nên bỏ z)
                    const x = startPos.x + (endPos.x - startPos.x) * t;

                    // Y theo parabol
                    const linearY = startPos.y + (endPos.y - startPos.y) * t;
                    const y = linearY + jumpHeight * 4 * t * (1 - t);

                    const currentPos = new Vec3(x, y, 0);
                    node.setPosition(currentPos);

                    // --- Xoay theo hướng di chuyển ---
                    const dir = currentPos.clone().subtract(lastPos);
                    if (!dir.equals(Vec3.ZERO)) {
                        const angleRad = Math.atan2(dir.y, dir.x); // radian
                        const angleDeg = angleRad * 180 / Math.PI;  // đổi sang độ
                        node.angle = angleDeg;
                    }

                    lastPos = currentPos.clone(); // cập nhật vị trí cũ
                }
            })
            .call(() => {
                this.rocket.getComponent(CircleCollider2D).enabled = true;
            })
            .delay(0.1)
            .call(() => {
                EnemyController.getInstance().node.children.forEach(child => {
                    if (child.getComponent(Enemy).hitDanCoi) {
                        child.getComponent(Enemy).die();
                    }
                });
                GameManager.getInstance().spawnVfxRocket(this.rocket.worldPosition);
                this.rocket.active = false;
            })
            .start();
    }
}


