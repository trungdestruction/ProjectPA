import { _decorator, Component, Label, math, Node, Skeleton, sp, Sprite, tween, v3, Vec3 } from 'cc';
import { CustomerController } from './CustomerController';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    order: Node = null;

    @property(Label)
    orderLabel: Label = null;

    @property(Sprite)
    fill: Sprite = null;

    orderNum: number = 5;
    total: number = 0;
    anim: sp.Skeleton = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(sp.Skeleton);
    }

    protected start(): void {
        // this.orderNum = Math.floor(Math.random() * 5 + 1);
        this.total = this.orderNum;
        this.orderLabel.string = this.orderNum.toString();
        this.order.active = false;
        this.anim.animation = 'Run';
        tween(this.node)
            .to(2, { position: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(CustomerController).isReady = true;
                this.ordering();
            })
            .start();
    }

    ordering() {
        this.anim.animation = 'Idle';
        this.order.active = true;
    }

    updateOrder() {
        this.orderNum -= 1;
        this.orderLabel.string = this.orderNum.toString();
        this.fill.fillRange += 1 / this.total;
        if (this.orderNum == 0) {
            this.order.active = false;
            this.node.parent.getComponent(CustomerController).isReady = false;
            this.node.parent.getComponent(CustomerController).spawnChar();
            GameManager.getInstance().spawnMoney(this.node.worldPosition);
            AudioManager.getInstance().playSoundCoin();
            tween(this.node)
                .delay(0.3)
                .call(() => {
                    GameManager.getInstance().updateMoney(this.total * 10);
                    this.anim.animation = 'Run';
                })
                .to(2, { position: v3(-1950, -1150, 0) })
                .call(() => {
                    this.node.destroy();
                })
                .start();
        }
    }
}


