import { _decorator, Component, Node, Animation, Vec2, Vec3, tween, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    order: Node = null;

    @property(Label)
    orderText: Label = null;

    anim: Animation = null;
    orderNum: number = 99;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    run(endPos: Vec3) {
        this.anim.play('RunCus');

        let distance = Vec3.distance(this.node.worldPosition, endPos);
        tween(this.node)
            .to(distance / 900, { worldPosition: endPos })
            .call(() => {
                this.anim.play('Idle');
                this.order.active = true;
            })
            .start();
    }

    updateOrder() {
        this.orderNum -= 1;
        this.orderText.string = this.orderNum.toString();
    }

    checkOut() {
        this.anim.play('Run');
        this.graphic.scale = Vec3.ONE;
        let oldPos = this.node.worldPosition;
        this.node.parent = this.node.parent.parent;
        this.node.worldPosition = oldPos;
        tween(this.node)
            .to(1, { position: new Vec3(this.node.worldPosition.x - 1000, this.node.worldPosition.y, 0) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }

    queueing(endPos: Node) {
        let oldPos = this.node.worldPosition;
        this.node.parent = endPos;
        this.node.worldPosition = oldPos;
        this.anim.play('Run');
        let distance = Vec3.distance(this.node.position, Vec3.ZERO);
        tween(this.node)
            .to(distance / 1000, { position: Vec3.ZERO })
            .call(() => {
                this.anim.play('Idle');
                this.order.active = true;
            })
            .start();
    }
}