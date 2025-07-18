import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonSungCoi')
export class ButtonSungCoi extends ButtonBase {
    @property(Node)
    sungCoi: Node = null;

    @property(Node)
    danCoi: Node = null;

    click(){
        AudioManager.getInstance().playSoundUpgade();
        this.sungCoi.active = true;
        this.danCoi.active = true;
        this.node.active = false;
    }
}


