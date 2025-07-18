import { _decorator, Component, Node, Animation, Sprite, tween, Vec3 } from 'cc';
import { GameManager } from '../src/GameManager';
import { Solider } from './Solider';
import { AudioManager } from '../src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Node)
    startPos: Node = null;

    @property(Node)
    endPos: Node = null;

    @property(Node)
    progress: Node = null;

    @property(Sprite)
    spriteProgress: Sprite = null;

    @property(Node)
    gun: Node = null;

    @property(Number)
    id: number = 0;

    anim: Animation = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.distance = Vec3.distance(this.startPos.position, this.endPos.position);
        this.node.position = this.startPos.position;
        this.scheduleOnce(() => {
            this.manufacture();
        }, 0.3)
    }

    manufacture() {
        this.anim.play('Manufacture0');

        this.progress.active = true;
        this.spriteProgress.fillRange = 0;

        tween(this.spriteProgress)
            .to(1.5 / GameManager.getInstance().speed, { fillRange: 1 })
            .call(() => {
                this.progress.active = false;
                this.carry();
            })
            .start();
    }

    carry() {
        this.anim.play('Carry180');
        this.gun.active = true;

        tween(this.node)
            .to(this.distance / 500 / GameManager.getInstance().speed, { position: this.endPos.position })
            .call(() => {
                this.gun.active = false;
                GameManager.getInstance().updateMoney(10);
                if (this.id == 1) {
                    let cus = GameManager.getInstance().cus1.getComponent(Solider);
                    cus.vfxCoin.getComponent(Animation).play('Coin');
                    cus.order.string = (Number(cus.order.string) - 1).toString();
                }
                if (this.id == 2) {
                    let cus = GameManager.getInstance().cus2.getComponent(Solider);
                    cus.vfxCoin.getComponent(Animation).play('Coin');
                    cus.order.string = (Number(cus.order.string) - 1).toString();
                }
                if (this.id == 3) {
                    let cus = GameManager.getInstance().cus3.getComponent(Solider);
                    cus.vfxCoin.getComponent(Animation).play('Coin');
                    cus.order.string = (Number(cus.order.string) - 1).toString();
                }
                AudioManager.getInstance().playSoundCoin();
                this.run();
            })
            .start();
    }

    run() {
        this.anim.play('Run0');

        tween(this.node)
            .to(this.distance / 500 / GameManager.getInstance().speed, { position: this.startPos.position })
            .call(() => {
                this.manufacture();
            })
            .start();
    }
}


