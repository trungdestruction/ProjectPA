import { _decorator, Component, Node, Animation, tween, Vec3, easing, Label } from 'cc';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
import { CustomerController } from './CustomerController';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    vfxCoin: Node = null;

    @property(Node)
    chatBox: Node = null;

    @property(Label)
    order: Label = null;

    anim: Animation = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.anim.play('Move');
    }

    moveToEndPos(pos1: Vec3, pos2: Vec3, endPos: Vec3) {
        let dis1 = Vec3.distance(this.node.position, pos1);
        let dis2 = Vec3.distance(pos1, pos2);
        let dis3 = Vec3.distance(pos2, endPos);
        let speed = 900;
        tween(this.node)
            .to(dis1 / speed, { position: pos1 })
            .to(dis2 / speed, { position: pos2 })
            .call(() => {
                // let oldPos = this.node.position;
                // this.node.parent = this.node.parent.getComponent(CustomerController).inRes;
                // this.node.position = oldPos;
                if (this.node.position.x > endPos.x) {
                    this.node.scale = new Vec3(-1, 1, 1);
                }
                else {
                    this.node.scale = Vec3.ONE;
                }
            })
            .to(dis3 / speed, { position: endPos })
            .call(() => {
                this.anim.play('Idle');
                this.node.scale = Vec3.ONE;
                this.chatBox.active = true;
                this.chatBox.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.chatBox)
                    .to(0.15, { scale: Vec3.ONE })
                    .start();
            })
            .start();
    }
}


