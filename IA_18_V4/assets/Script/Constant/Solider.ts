import { _decorator, Component, Node, Animation, tween, Vec3 } from 'cc';
import { OrderPos } from '../OrderPos';
import { GameManager } from '../src/GameManager';
import { AudioManager } from '../src/AudioManager';
import { SoliderController } from '../SoliderController';
import { BossController } from '../BossController';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    order: Node = null;

    anim: Animation = null;
    distance: number = 0;
    readyBattle: boolean = false;


    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    run(endPos: Node, order: boolean) {
        let oldPos = this.node.worldPosition;
        this.node.parent = endPos;
        this.node.worldPosition = oldPos;

        if (!order) {
            this.anim.play('Run90');
            this.node.scale = new Vec3(-1, 1, 1);
        }

        let timeMove = Vec3.distance(this.node.position, Vec3.ZERO) / 800;
        tween(this.node)
            .to(timeMove, { position: Vec3.ZERO })
            .call(() => {
                this.anim.play('Idle0');
                this.node.scale = Vec3.ONE;
                if (order) {
                    this.order.active = true;
                    this.order.scale = new Vec3(0.1, 0.1, 0.1);
                    tween(this.order)
                        .to(0.2, { scale: Vec3.ONE })
                        .start();
                    this.scheduleOnce(() => {
                        this.node.parent.getComponent(OrderPos).ready = true;
                    }, 1.1)
                }
            })
            .start();
    }

    toBattleZone() {
        GameManager.getInstance().spawnVfxCoin(this.node.worldPosition);
        AudioManager.getInstance().playSoundCoin();
        this.order.active = false;

        let pos = SoliderController.getInstance().checkEmpty();
        let parent = SoliderController.getInstance().battleZone.children[pos];
        let oldPos = this.node.worldPosition;
        this.node.parent = parent;
        this.node.worldPosition = oldPos;
        let distance = Vec3.distance(this.node.worldPosition, parent.worldPosition);
        this.anim.play('Carry180');
        tween(this.node)
            .to(distance / 500, { position: Vec3.ZERO })
            .call(() => {
                this.readyBattle = true;
                if (pos <= 5) {
                    this.anim.play('Atk135');
                }
                else if (pos >= 15) {
                    this.node.scale = new Vec3(-1, 1, 1);
                    this.anim.play('Atk135');
                }
                else {
                    this.anim.play('Atk180');
                }
                AudioManager.getInstance().playSoundGun();
                BossController.getInstance().takeDame(50);
                this.schedule(() => {
                    AudioManager.getInstance().playSoundGun();
                    BossController.getInstance().takeDame(50);
                }, 1.03);
            })
            .start();
    }

    die() {
        if (!this.readyBattle) return;
        this.anim.play('Die180');
        tween(this.node)
            .delay(0.64)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


