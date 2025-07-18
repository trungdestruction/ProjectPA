import { _decorator, Component, Node, Animation, Vec3, tween } from 'cc';
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

    run(endPos: Vec3) {
        this.isDead = true;
        this.anim.play('Run');
        let distance = Vec3.distance(this.node.position, endPos);
        this.vfxBullet.position = new Vec3(0, - 100 - endPos.y, 0);
        tween(this.node)
            .to(distance / 700, { position: endPos })
            .call(() => {
                this.anim.play('Atk');
                this.isDead = false;
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


