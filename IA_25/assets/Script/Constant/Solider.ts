import { _decorator, Component, Node, Animation, Label, color, tween, Vec3 } from 'cc';
import { AudioManager } from '../src/AudioManager';
import { EnemyController } from '../EnemyController';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Label)
    labelBullet: Label = null;

    @property(Node)
    enemyZone: Node = null;

    speed: number = 0.6;
    bullet: number = 5;
    shooting: boolean = false;
    anim: Animation = null;
    distance: number = 0;


    protected onLoad(): void {
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
            AudioManager.getInstance().playSoundGun();
            this.shooting = true;

            let duration = 0.42;
            let stateAtk = this.anim.getState('Atk30');
            stateAtk.speed = this.speed;
            this.anim.play('Atk30');

            if (!stateAtk) {
                console.warn('Không tìm thấy animation "Atk"');
                this.shooting = false;
                return;
            }

            // EnemyController.getInstance().kill(this.node);
            if (EnemyController.getInstance().kill(this.node).position.x < 500) {
                this.graphic.scale = new Vec3(-1, 1, 1);
            }
            else{
                this.graphic.scale = Vec3.ONE;
            }

            tween(this.node)
                .delay(duration / this.speed)
                .call(() => {
                    this.shooting = false;
                    this.atk(); // Gọi lại nếu còn enemy
                })
                .start();
        }
        else {
            this.graphic.scale = Vec3.ONE;
            this.anim.play('Idle30');
            this.shooting = false;
        }
    }
}


