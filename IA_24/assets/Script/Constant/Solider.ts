import { _decorator, Component, Node, Animation, Label, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Node)
    vfxCoin: Node = null;

    @property(Node)
    chatBox: Node = null;

    @property(Label)
    order: Label = null;

    @property(Node)
    emoji: Node = null;

    anim: Animation = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.anim.play('Run0');
    }

    moveToEndPos(endPos: Vec3) {
        let dis = Vec3.distance(this.node.position, endPos);
        let speed = 900;
        tween(this.node)
            .to(dis / speed, { position: endPos })
            .call(() => {
                this.anim.play('Idle0');
                this.node.scale = new Vec3(1.5, 1.5, 1.5);
                this.chatBox.active = true;
                this.chatBox.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.chatBox)
                    .to(0.15, { scale: new Vec3(0.8, 0.8, 0.8) })
                    .start();
            })
            .start();
    }

    changeEmoji() {
        this.scheduleOnce(() => {
            tween(this.chatBox)
                .to(0.2, { scale: Vec3.ZERO })
                .call(() => {
                    this.chatBox.active = false;
                    this.emoji.active = true;
                    this.emoji.scale = new Vec3(0.1, 0.1, 0.1);
                    tween(this.emoji)
                        .to(0.2, { scale: new Vec3(0.8, 0.8, 0.8) })
                        .start();
                })
                .start();
        }, this.getRandom(15, 25))
    }

    getRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}


