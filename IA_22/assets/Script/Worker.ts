import { _decorator, Animation, Component, Node, Sprite, tween, Vec3 } from 'cc';
import { GameManager } from './src/GameManager';
import { Solider } from './Solider';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;
    @property(Node)
    box: Node = null;
    @property(Node)
    progress: Node = null;
    @property(Sprite)
    spriteProgress: Sprite = null;
    @property(Animation)
    vfxUpgrade: Animation = null;
    @property(Node)
    solider: Node = null;

    anim: Animation = null;
    isInOrder: boolean = false;
    soliderOrder: Node = null;
    soliderOrderQueue: Node = null;
    soliderPos: Vec3 = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.soliderOrderQueue = this.solider;
        this.soliderOrder = this.soliderOrderQueue;
        this.order(this.soliderOrder);
    }

    order(solider: Node) {
        if (this.soliderOrder.active == false) {
            this.scheduleOnce(() => {
                this.order(this.soliderOrder)
            }, 0.5);
            return;
        }
        this.soliderOrder = solider;
        this.soliderPos = this.node.parent.inverseTransformPoint(new Vec3(), this.soliderOrder.worldPosition);
        this.soliderPos = new Vec3(this.soliderPos.x, this.soliderPos.y - 50, 0);
        this.distance = Vec3.distance(Vec3.ZERO, this.soliderPos);
        this.isInOrder = true;
        this.manufacture();
    }

    manufacture() {
        this.anim.play('Manufacture');

        this.progress.active = true;
        this.spriteProgress.fillRange = 0;

        tween(this.spriteProgress)
            .to(1 / GameManager.getInstance().speed, { fillRange: 1 })
            .call(() => {
                this.progress.active = false;
                this.carry();
            })
            .start();
    }

    carry() {
        this.anim.play('Carry');
        this.box.active = true;
        tween(this.node)
            .to(this.distance / 600 / GameManager.getInstance().speed, { position: this.soliderPos })
            .call(() => {
                this.soliderOrder.getComponent(Solider).updateBullet(5);
                this.anim.play('Run');
                this.box.active = false;
            })
            .to(this.distance / 600 / GameManager.getInstance().speed, { position: Vec3.ZERO })
            .call(() => {
                if (this.soliderOrderQueue != null) {
                    this.soliderOrder = this.soliderOrderQueue;
                    // this.soliderOrderQueue = null;
                    this.order(this.soliderOrder);
                }
                else {
                    this.anim.play('Idle');
                    this.isInOrder = false;
                }
            })
            .start();
    }
}


