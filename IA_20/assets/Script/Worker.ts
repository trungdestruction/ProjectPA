import { _decorator, Component, Node, Animation, tween, Vec3 } from 'cc';
import { Solider } from './Solider';
import { SoliderRocket } from './SoliderRocket';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    p1: Node = null;

    @property(Node)
    p2: Node = null;

    @property(Node)
    graphic: Node = null;

    @property(Node)
    solider: Node = null;

    @property(Boolean)
    rocket: boolean = false;

    anim: Animation = null;
    timeMove: number = 1.4/2;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.node.position = this.p1.position;
        this.carry();
    }

    run() {
        this.anim.play('Run');
        tween(this.node)
            .to(this.timeMove, { position: this.p1.position })
            .call(() => {
                this.carry();
            })
            .start();
    }

    carry() {
        this.anim.play('Carry');
        tween(this.node)
            .to(this.timeMove, { position: this.p2.position })
            .call(() => {
                if (!this.rocket) {
                    this.solider.getComponent(Solider).updateBullet(4);
                }
                else {
                    this.solider.getComponent(SoliderRocket).updateBullet(2);
                }
                this.run();
            })
            .start();
    }
}


