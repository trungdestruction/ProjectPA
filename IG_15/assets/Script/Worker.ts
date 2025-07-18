import { _decorator, Animation, Component, Game, Label, Node, sp, Sprite, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Customer } from './Customer';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Sprite)
    progress: Sprite = null;

    @property(Node)
    progressNode: Node = null;

    @property(Label)
    text: Label = null;

    anim: Animation = null;
    timeProgress: number = 2.25;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    work() {
        let atkState = this.anim.getState('Atk');
        atkState.speed = GameManager.getInstance().speed / 1.5;
        this.anim.play('Atk');

        // Tính thời gian tổng cộng
        let duration = this.timeProgress / GameManager.getInstance().speed;

        // Hiện node progress bar
        this.progressNode.active = true;
        this.progress.fillRange = 0;

        // Tạo object đếm số
        let counter = { value: duration };

        // Tween song song: progress bar + countdown label
        tween(counter)
            .to(duration, { value: 0 }, {
                onUpdate: () => {
                    this.text.string = Math.floor(counter.value).toString();
                },
                onComplete: () => {
                    this.text.string = '0';
                    this.progressNode.active = false;
                }
            })
            .start();

        tween(this.progress)
            .to(duration, { fillRange: 1 })
            .call(() => {
                this.carry();
            })
            .start();
    }

    carry() {
        let carryState = this.anim.getState('Carry');
        carryState.speed = GameManager.getInstance().speed / 2;
        this.anim.play('Carry');

        let distance = Vec3.distance(this.node.worldPosition, GameManager.getInstance().serve.worldPosition);

        tween(this.node)
            .to(distance / 300 / GameManager.getInstance().speed, { worldPosition: GameManager.getInstance().serve.worldPosition })
            .call(() => {
                let vfxCoin = GameManager.getInstance().serve.children[0].getComponent(Animation);
                vfxCoin.play('Coin');
                AudioManager.getInstance().playSoundCoin();
                GameManager.getInstance().updateMoney(GameManager.getInstance().price);
                GameManager.getInstance().customer.getComponent(Customer).updateOrder();
                this.run();
            })
            .start();
    }

    run() {
        let runState = this.anim.getState('Run');
        runState.speed = GameManager.getInstance().speed / 1.5;
        this.anim.play('Run');

        let distance = Vec3.distance(this.node.position, Vec3.ZERO);


        tween(this.node)
            .to(distance / 300 / GameManager.getInstance().speed, { position: Vec3.ZERO })
            .call(() => {
                this.work();
            })
            .start();
    }
}


