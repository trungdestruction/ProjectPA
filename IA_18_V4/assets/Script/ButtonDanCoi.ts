import { _decorator, builtinResMgr, Component, Node } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonDanCoi')
export class ButtonDanCoi extends Component {
    @property(Node)
    worker: Node = null;

    @property(Node)
    danCoi: Node = null;

    @property(Node)
    sungCoi: Node = null;

    click() {
        AudioManager.getInstance().playSoundUpgade();
        this.worker.active = true;
        this.danCoi.active = true;
        this.sungCoi.active = true;
        this.node.active = false;
    }
}


