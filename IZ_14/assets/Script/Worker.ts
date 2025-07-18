import { _decorator, Component, Node, sp, tween, Animation, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Customer } from './Customer';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    startPos: Node = null;

    @property(Node)
    endPos: Node = null;

    @property(Node)
    brain: Node = null;

    @property(Node)
    costumer: Node = null;

    distance: number = 0;
    anim: Animation = null;

    protected start(): void {
        this.anim = this.node.getComponent(Animation);
        this.distance = Vec3.distance(this.startPos.getPosition(), this.endPos.getPosition());
        this.toBrain();
    }

    toBrain() {
        this.brain.active = false;
        this.anim.play('Worker');
        this.node.scale = new Vec3(0.4, 0.4, 0.4);
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speed, { position: this.endPos.getPosition(), scale: new Vec3(0.37, 0.37, 0.37) })
            .call(() => {
                AudioManager.getInstance().playSoundPop();
                this.toCustomer();
            })
            .start();
    }

    toCustomer() {
        this.brain.active = true;
        this.anim.play('Worker_Bring');
        this.node.scale = new Vec3(-0.35, 0.35, 0.35);
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speed, { position: this.startPos.getPosition(), scale: new Vec3(-0.4, 0.4, 0.4) })
            .call(() => {
                this.costumer.getComponent(Customer).updateOrder();
                this.toBrain();
            })
            .start();
    }
}


