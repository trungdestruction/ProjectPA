import { _decorator, Component, Node, Animation, tween } from 'cc';
import { SoliderController } from './SoliderController';
import { Solider } from './Solider';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BossController')
export class BossController extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    wall: Node = null;

    anim: Animation = null;

    private static _instance: BossController = null;
    public static getInstance(): BossController {
        return BossController._instance;
    }

    protected onLoad(): void {
        BossController._instance = this;
    }

    protected start(): void {
        this.anim = this.graphic.getComponent(Animation);
        this.schedule(() => {
            this.wallTakeDame();
        }, 1.19)
        this.attack();
        tween(this.node)
            .delay(0.9)
            .call(() => {
                this.anim.play('Attack');
            })
            .start();
    }

    attack() {
        this.schedule(() => {
            this.checkSolider().getComponent(Solider).die();
        }, 4.8);
    }

    wallTakeDame() {
        this.wall.getComponent(Animation).play('WallTakeDame');
        AudioManager.getInstance().playSoundCrash();
    }

    checkSolider(): Node {
        let ran = Math.floor(Math.random() * 12);
        if (SoliderController.getInstance().battlePos[ran].children.length > 0) {
            return SoliderController.getInstance().battlePos[ran].children[0];
        }
        else {
            return this.checkSolider();
        }
    }
}


