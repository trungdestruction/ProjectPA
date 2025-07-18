import { _decorator, Component, Node, Animation, Sprite, tween, log, Vec3 } from 'cc';
import { WorkerController } from './WorkerController';
import { Solider } from './Solider';
import { CheckPos } from './CheckPos';
import { SoliderController } from './SoliderController';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;
    @property(Node)
    gun: Node = null;
    @property(Node)
    progress: Node = null;
    @property(Sprite)
    spriteProgress: Sprite = null;
    @property(Animation)
    vfxUpgrade: Animation = null;

    anim: Animation = null;
    isCarrying: boolean = false;
    solider: Node = null;

    protected start(): void {
        this.anim = this.graphic.getComponent(Animation);
        this.scheduleOnce(() => {
            this.run();
        }, 0.2)
    }

    run() {
        if (this.isCarrying) return;
        this.anim.play('Run');
        this.gun.active = false;
        let id = this.queue();
        let endPos = WorkerController.getInstance().checkPosQueue[id];
        let oldPos = this.node.worldPosition;
        this.node.parent = endPos;
        this.node.worldPosition = oldPos;
        let distance = Vec3.distance(this.node.worldPosition, endPos.worldPosition);

        tween(this.node)
            .to(distance / 300, { position: Vec3.ZERO })
            .call(() => {
                if (id == 0) {
                    this.manufacture();
                }
                else {
                    this.anim.play('Idle');
                }
            })
            .start();

    }

    queue(): number {
        let posQueue = WorkerController.getInstance().checkPosQueue;
        for (let i = 0; i < posQueue.length; i++) {
            if (posQueue[i].children.length == 0) {
                return i;
            }
        }
    }

    manufacture() {
        this.anim.play('Manufacture');

        this.progress.active = true;
        this.spriteProgress.fillRange = 0;

        tween(this.spriteProgress)
            .to(WorkerController.getInstance().timeProgress, { fillRange: 1 })
            .call(() => {
                this.progress.active = false;
                this.isCarrying = true;
                let solider = SoliderController.getInstance().getSolider();
                solider.getComponent(Solider).isServing = true;
                this.carrying(solider);
            })
            .start();
    }

    carrying(solider: Node) {
        this.anim.play('Carrying');
        this.gun.active = true;
        let oldPos = this.node.worldPosition;
        this.node.parent = WorkerController.getInstance().serve;
        this.node.worldPosition = oldPos;
        WorkerController.getInstance().workerRun();
        tween(this.node)
            .to(0.8, { worldPosition: new Vec3(solider.worldPosition.x, solider.worldPosition.y - 85, 0) })
            .call(() => {
                solider.getComponent(Solider).toBattleZone();
                this.isCarrying = false;
                this.run();
            })
            .start();
    }
}