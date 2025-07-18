import { _decorator, Component, Node, Animation, Vec3, tween, Sprite, UITransform } from 'cc';
import { WorkerController } from '../WorkerController';
import { SoliderController } from '../SoliderController';
import { OrderPos } from '../OrderPos';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
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
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.manufacture();
    }

    run() {
        this.gun.active = false;

        // let oldPos = this.node.worldPosition;
        // this.node.parent = endPos;
        // this.node.worldPosition = oldPos;

        let timeMove = Vec3.distance(this.node.position, Vec3.ZERO) / 600;
        this.anim.play('Run0');
        tween(this.node)
            .to(timeMove, { position: Vec3.ZERO })
            .call(() => {
                this.manufacture();
            })
            .start();
    }

    manufacture() {
        // let arr = WorkerController.getInstance().workerArr;
        // let index = arr.indexOf(this.node);
        // arr.splice(index, 1);

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
        let endNode = SoliderController.getInstance().serving();
        let endPos = this.node.parent.inverseTransformPoint(new Vec3(), endNode.worldPosition);
        endPos = new Vec3(endPos.x, endPos.y - 60, endPos.z);
        // let oldPos = this.node.worldPosition;
        // this.node.parent = WorkerController.getInstance().servePos;
        // this.node.worldPosition = oldPos;

        let timeMove = Vec3.distance(this.node.position, endPos) / 700;
        this.anim.play('Carry180');
        this.gun.active = true;

        // WorkerController.getInstance().queue();
        endNode.getComponent(OrderPos).ready = false;
        tween(this.node)
            .to(timeMove, { position: endPos })
            .call(() => {
                endNode.getComponent(OrderPos).order();
                this.run();
            })
            .start();
    }
}


