import { _decorator, Component, Node, Sprite, Vec3, Animation, tween } from 'cc';
import { WorkerController } from './WorkerController';
import { SungCoiController } from './SungCoiController';
const { ccclass, property } = _decorator;

@ccclass('WorkerSungCoi')
export class WorkerSungCoi extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Node)
    progress: Node = null;

    @property(Sprite)
    spriteProgress: Sprite = null;

    @property(Node)
    gun: Node = null;

    anim: Animation = null;

    @property(Node)
    p1: Node = null;

    @property(Node)
    p2: Node = null;

    @property(Node)
    p3: Node = null;

    d1: number = 0;
    d2: number = 0;
    firstPlay: boolean = false;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.d1 = Vec3.distance(this.p1.position, this.p2.position);
        this.d2 = Vec3.distance(this.p2.position, this.p3.position);
        this.manufacture();
    }

    manufacture() {
        this.anim.play('Manufacture0');
        this.progress.active = true;
        this.spriteProgress.fillRange = 0;

        tween(this.spriteProgress)
            .to(WorkerController.getInstance().timeProgress, { fillRange: 1 })
            .call(() => {
                this.progress.active = false;
                this.carrying();
            })
            .start();
    }

    carrying() {
        this.gun.active = true;
        this.anim.play('Carry180');

        tween(this.node)
            .to(this.d1 / 600, { position: this.p2.position })
            .to(this.d2 / 600, { position: this.p3.position })
            .call(() => {
                if (!this.firstPlay) {
                    this.firstPlay = true;
                    this.node.parent.getComponent(SungCoiController).firstPlay();
                }
                this.run();
            })
            .start();
    }

    run() {
        this.gun.active = false;
        this.anim.play('Run0');

        tween(this.node)
            .to(this.d2 / 600, { position: this.p2.position })
            .to(this.d1 / 600, { position: this.p1.position })
            .call(() => {
                this.manufacture();
            })
            .start();
    }
}


