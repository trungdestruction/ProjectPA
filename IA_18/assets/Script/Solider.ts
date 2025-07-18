import { _decorator, Component, Node, Animation, Vec3, tween, AudioSource } from 'cc';
import { SoliderController } from './SoliderController';
import { CheckPos } from './CheckPos';
import { GameManager } from './GameManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {
    @property(Node)
    gunOrder: Node = null;

    @property(Node)
    graphic: Node = null;

    @property(Node)
    fireL: Node = null;

    @property(Node)
    fireR: Node = null;

    @property(Node)
    fireM: Node = null;

    @property(Boolean)
    tuto: boolean = false;

    id: number = 0;
    isServing: boolean = false;
    readyBattle: boolean = false;

    soliderController: SoliderController = null;
    anim: Animation = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        if (this.tuto) {
            this.move();
        }
    }

    move() {
        this.anim.play('Run');
        let distance = Vec3.distance(this.node.position, Vec3.ZERO);
        tween(this.node)
            .to(distance / 800, { position: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(CheckPos).isWaitting = true;
                this.anim.play('Idle');
                this.gunOrder.active = true;
            })
            .start();
    }

    toBattleZone() {
        GameManager.getInstance().spawnVfxCoin(this.node.worldPosition);
        GameManager.getInstance().updateMoney(30);
        AudioManager.getInstance().playSoundCoin();
        this.gunOrder.active = false;

        let pos = SoliderController.getInstance().checkEmpty();
        let parent = SoliderController.getInstance().battlePos[pos];
        let oldPos = this.node.worldPosition;
        this.node.parent = parent;
        this.node.worldPosition = oldPos;
        let distance = Vec3.distance(this.node.worldPosition, parent.worldPosition);
        this.anim.play('RunGun');
        tween(this.node)
            .to(distance / 500, { position: Vec3.ZERO })
            .call(() => {
                this.readyBattle = true;
                if (pos <= 3) {
                    this.anim.play('GunR');
                    this.fireR.active = true;
                }
                else if (pos >= 8) {
                    this.anim.play('GunM');
                    this.fireM.active = true;
                }
                else {
                    this.anim.play('GunL');
                    this.fireL.active = true;
                }
                AudioManager.getInstance().playSoundGun();
                this.schedule(() => {
                    AudioManager.getInstance().playSoundGun();
                }, 1.03);
            })
            .start();
        SoliderController.getInstance().queue();
    }

    die() {
        if (!this.readyBattle) return;
        this.anim.play('Die');
        this.fireR.active = false;
        this.fireL.active = false;
        this.fireM.active = false;
        tween(this.node)
            .delay(0.64)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


