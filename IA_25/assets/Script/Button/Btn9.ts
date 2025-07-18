import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from '../src/ButtonBase';
import { GameManager } from '../src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Btn9')
export class Btn9 extends ButtonBase {
    click() {
        GameManager.getInstance().onHandlerGotoStore();
    }
}


