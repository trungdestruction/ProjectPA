import { _decorator, Component, Node, Animation, tween } from 'cc';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Attacker')
export class Attacker extends Component {
    @property(Node)
    zone: Node = null;

    @property(Boolean)
    upZone: boolean = false;

    @property(Node)
    upgrade: Node = null;

    reload: number = 1.5;

    anim: Animation = null;

    onLoad() {
        this.anim = this.node.children[0].getComponent(Animation);
        this.scheduleOnce(() => {
            this.shoot();
        }, 5)
    }

    shoot() {
        let timeAnim = 0.47;
        tween(this.node)
            .call(() => {
                this.anim.play('Attack');
                AudioManager.getInstance().playSoundGun();
                if (this.upZone) {
                    if (this.zone.children.length > 0) {
                        this.zone.children[this.zone.children.length - 1].destroy();
                    }
                }
                else {
                    if (this.zone.children.length > 0) {
                        this.zone.children[0].destroy();
                    }
                }

            })
            .delay(timeAnim)
            .call(() => {
                this.anim.play('IdleScale');
            })
            .delay(this.reload)
            .call(() => {
                this.shoot();
            })
            .start();
    }
}


