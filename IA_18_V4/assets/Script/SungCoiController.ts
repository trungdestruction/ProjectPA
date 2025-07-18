import { _decorator, Component, Animation, repeat, Node, macro } from 'cc';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
import { BossController } from './BossController';
const { ccclass, property } = _decorator;

@ccclass('SungCoiController')
export class SungCoiController extends Component {
    @property(Animation)
    sungCoi: Animation = null;

    @property(Node)
    chatBox: Node = null;

    firstPlay() {
        this.sungCoi.play('SungCoi');
        this.chatBox.active = false;
        this.schedule(() => {
            GameManager.getInstance().spawnVfxBoom();
            AudioManager.getInstance().playSoundCrash();
            BossController.getInstance().takeDame(200);
        }, 1.95, macro.REPEAT_FOREVER, 1.9);
    }
}