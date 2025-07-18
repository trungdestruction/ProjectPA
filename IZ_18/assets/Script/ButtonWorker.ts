import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonWorker')
export class ButtonWorker extends ButtonBase {
    @property(Node)
    worker1: Node = null;

    @property(Node)
    worker2: Node = null;
    
    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.worker1.active = true;

                this.btnPrice = 120;
                this.label.string = this.btnPrice.toString();

                break;

            case 1:
                this.worker2.active = true;

                this.btnPrice = 200;
                this.label.string = this.btnPrice.toString();

                break;

            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.clickEvent();
    }
}


