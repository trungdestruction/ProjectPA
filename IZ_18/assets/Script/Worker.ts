import { _decorator, Component, Node, Animation, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    solider: Node = null;

    anim: Animation = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        if (this.solider.active) {
            this.carry();
        }
    }

    carry() {
        this.anim.play('Carry');
        this.graphic.scale = Vec3.ONE;
        tween(this.node)
            .to(1, { position: new Vec3(275, -130, 0) })
            .call(() => {
                this.run();
            })
            .start();
    }

    run() {
        this.anim.play('Run');
        this.graphic.scale = new Vec3(-1, 1, 0);
        tween(this.node)
            .to(1, { position: new Vec3(0, -130, 0) })
            .call(() => {
                this.carry();
            })
            .start();
    }
}


