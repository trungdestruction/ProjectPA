import { _decorator, Component, Node } from 'cc';
import { GameManager } from '../src/GameManager';
import { ButtonBase } from '../src/ButtonBase';
import { LineController } from '../LineController';
const { ccclass, property } = _decorator;

@ccclass('ButtonBath')
export class ButtonBath extends ButtonBase {

    protected start(): void {
        this.node.children[1].active = false;
    }


    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.node.parent.getComponent(LineController).unlockBath();

        this.clickEvent();
    }
}


