import { _decorator, Component, Node, Animation, tween, Vec3, easing } from 'cc';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    vfxCoin: Node = null;

    @property(Node)
    chatBox: Node = null;

    anim: Animation = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.anim.play('Idle');
        let result = Math.random() < 0.5;
        if (result) {
            this.chatBox.active = true;
        }
    }

    closeChatBox() {
        tween(this.chatBox)
            .to(0.3, { scale: Vec3.ZERO })
            .call(() => {
                this.chatBox.active = false;
            })
            .start();
    }

    move() {
        this.anim.play('Move');
        let oldPosX = this.node.position.x;
        tween(this.node)
            .to(0.5 / GameManager.getInstance().speed, { position: new Vec3(oldPosX + 150, 0, 0) })
            .call(() => {
                this.anim.play('Idle');
            })
            .start();
    }

    out() {
        this.vfxCoin.active = true;
        this.anim.play('Move');
        tween(this.node)
            .to(3.5 / GameManager.getInstance().speed, { position: new Vec3(3200, 0, 0) }, { easing: easing.quadIn })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


