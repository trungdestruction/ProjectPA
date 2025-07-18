import { _decorator, Component, Label, Node, Animation, Vec3, tween, color, math, v2 } from 'cc';
import { EnemyController } from './EnemyController';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SoliderRocket')
export class SoliderRocket extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Label)
    labelBullet: Label = null;

    @property(Node)
    addBullet: Node = null;

    @property(Node)
    rocket: Node = null;

    @property(Node)
    startPos: Node = null;

    @property(Node)
    enemyZone: Node = null;

    bullet: number = 5;
    anim: Animation = null;
    shooting: boolean = false;

    onLoad() {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.updateBullet(0);
    }

    updateBullet(num: number) {
        if (num > 0) {
            this.showAddBullet();
        }

        this.bullet += num;
        this.labelBullet.string = this.bullet.toString();

        if (this.bullet > 0) {
            this.labelBullet.color = color(255, 255, 255);

            // Kiểm tra enemyZone để tránh gọi atk() sai lúc
            if (this.enemyZone.children.length > 0) {
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
            let duration = 0.4;
            this.anim.play('AtkRocket');
            this.rocket.active = true;
            this.rocket.position = this.startPos.position;
            let endPos = EnemyController.getInstance().kill(this.node);
            if (endPos == undefined) {
                this.shooting = false;
                return;
            }
            let localPos = this.node.inverseTransformPoint(new Vec3(), endPos.worldPosition);
            const dir = v2(localPos.x - this.startPos.position.x, localPos.y - this.startPos.position.y);

            // Tính góc bằng atan2, rồi chuyển sang độ
            const angleRad = Math.atan2(dir.y, dir.x);
            const angleDeg = math.toDegree(angleRad);
            this.rocket.angle = angleDeg;

            tween(this.rocket)
                .to(0.2, { position: localPos })
                .call(() => {
                    GameManager.getInstance().spawnVfxRocket(this.rocket.worldPosition);
                    AudioManager.getInstance().playSoundCrash();
                    this.rocket.active = false;
                })
                .start();

            tween(this.node)
                .delay(duration * 1.5)
                .call(() => {
                    this.shooting = false;
                    this.atk(); // Gọi lại nếu còn enemy
                })
                .start();
        }
        else {
            this.shooting = false;
        }
    }

    showAddBullet() {
        this.addBullet.active = true;
        this.addBullet.position = new Vec3(-80, -10, 0);
        tween(this.addBullet)
            .to(0.5, { position: new Vec3(-80, 80, 0) })
            .call(() => {
                this.addBullet.active = false;
            })
            .start();
    }
}

