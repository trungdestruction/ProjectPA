import { _decorator, Component, Node, Animation, Vec2, Vec3, tween } from 'cc';
import { GameManager } from './src/GameManager';
import { Customer } from './Customer';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Chef')
export class Chef extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    burger: Node = null;

    @property(Node)
    startPos: Node = null;

    @property(Node)
    endPos: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Number)
    id: number = 0;

    anim: Animation = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.distance = Vec3.distance(this.startPos.position, this.endPos.position);
        this.node.position = this.endPos.position;
        tween(this.node)
            .delay(0.3)
            .call(() => {
                this.moveDown();
            })
            .start();
    }

    moveDown() {
        this.anim.play('MoveDown');
        this.burger.active = false;
        this.node.scale = Vec3.ONE;
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speedChef, { position: this.startPos.position })
            .call(() => {
                this.moveUp();
            })
            .start();
    }

    moveUp() {
        this.anim.play('MoveUp');
        this.burger.active = true;
        this.node.scale = new Vec3(-1, 1, 1);
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speedChef, { position: this.endPos.position })
            .call(() => {
                if (this.id == 1) {
                    let cus = GameManager.getInstance().cus1.getComponent(Customer);
                    cus.vfxCoin.getComponent(Animation).play('Coin');
                    cus.order.string = (Number(cus.order.string) - 1).toString();
                }
                if (this.id == 2) {
                    let cus = GameManager.getInstance().cus2.getComponent(Customer);
                    cus.vfxCoin.getComponent(Animation).play('Coin');
                    cus.order.string = (Number(cus.order.string) - 1).toString();
                }
                if (this.id == 3) {
                    let cus = GameManager.getInstance().cus3.getComponent(Customer);
                    cus.vfxCoin.getComponent(Animation).play('Coin');
                    cus.order.string = (Number(cus.order.string) - 1).toString();
                }
                AudioManager.getInstance().playSoundCoin();
                this.moveDown();
            })
            .start();
    }
}


