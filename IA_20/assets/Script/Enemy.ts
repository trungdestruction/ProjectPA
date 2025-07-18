import { _decorator, Component, Node, Animation, Vec2, Vec3, tween } from 'cc';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    vfxBullet: Node = null;

    isDead: boolean = false;
    anim: Animation = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.anim.play('Atk');
    }

    run(endPos: Vec3) {
        this.anim.play('Run');
        tween(this.node)
            .to(0.6, { position: endPos })
            .call(() => {
                if (!this.isDead) {
                    this.anim.play('Atk');
                    this.vfxBullet.position = new Vec3((this.node.position.x - 320) / 1.8, 0, 0);
                }
            })
            .start();
    }

    die() {
        this.anim.play('Die');
        GameManager.getInstance().spawnCoin(this.node.worldPosition);
        tween(this.node)
            .delay(0.65)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


