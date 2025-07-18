import { _decorator, Component, Label, Node, Animation, color, tween, Vec3 } from 'cc';
import { AudioManager } from './src/AudioManager';
import { EnemyController } from './EnemyController';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Label)
    labelBullet: Label = null;

    @property(Node)
    addBullet: Node = null;

    @property(Node)
    enemyZone: Node = null;

    speed: number = 1 / 1.2;
    bullet: number = 5;
    anim: Animation = null;
    shooting: boolean = false;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.labelBullet.string = this.bullet.toString();

        this.scheduleOnce(() => {
            this.updateBullet(0);
        }, 0.65);
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
            if (!this.shooting) {
                if (this.enemyZone.children.length > 0 || EnemyController.getInstance().currentCar != null) {
                    this.atk();
                }
            }
        } else {
            this.labelBullet.color = color(255, 0, 0);
            GameManager.getInstance().order(this.node);
        }
    }

    atk() {
        if (this.bullet > 0) {
            if (this.enemyZone.children.length > 0 || EnemyController.getInstance().currentCar != null) {
                if (this.shooting) return;
                // AudioManager.getInstance().playSoundGun();
                this.shooting = true;

                let duration = 0.37;
                let stateAtk = this.anim.getState('Atk');
                stateAtk.speed = this.speed;
                this.anim.play('Atk');

                if (!stateAtk) {
                    console.warn('Không tìm thấy animation "Atk"');
                    this.shooting = false;
                    return;
                }

                EnemyController.getInstance().kill(this.node); // hoặc delay nếu cần hiệu ứng

                tween(this.node)
                    .delay(duration / this.speed + 0.2)
                    .call(() => {
                        this.shooting = false;
                        this.atk(); // Gọi lại nếu còn enemy
                    })
                    .start();
            }
            else {
                this.anim.play('Idle');
                this.shooting = false;
            }
        }
        else {
            this.anim.play('Idle');
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