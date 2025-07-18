import { _decorator, Button, Component, Node } from 'cc';
import { ButtonBase } from './ButtonBase';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
import { Solider } from './Solider';
const { ccclass, property } = _decorator;

@ccclass('ButtonWorker')
export class ButtonWorker extends ButtonBase {
    @property(Node)
    worker1: Node = null;

    @property(Node)
    solider: Node = null;

    @property(Node)
    worker2: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.worker1.active = true;
                GameManager.getInstance().worker.push(this.worker1);
                // if (this.solider.getComponent(Solider).bullet == 0) {
                //     GameManager.getInstance().order(this.solider);
                // }

                this.btnPrice = 100;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);
                break;

            case 1:
                this.worker2.active = true;
                GameManager.getInstance().worker.push(this.worker2);

                this.btnPrice = 200;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                break;

            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.clickEvent();
    }
}


