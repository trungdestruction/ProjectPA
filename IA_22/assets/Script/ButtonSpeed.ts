import { _decorator, Button, Component, Node } from 'cc';
import { ButtonBase } from './ButtonBase';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
import { Worker } from './Worker';
const { ccclass, property } = _decorator;

@ccclass('ButtonSpeed')
export class ButtonSpeed extends ButtonBase {

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        switch (this.countClick) {
            case 0:
                let workerUpgrade = GameManager.getInstance().worker;
                workerUpgrade.forEach(worker => {
                    worker.getComponent(Worker).vfxUpgrade.play('Upgrade');
                });
                GameManager.getInstance().speed = 1.1;

                this.btnPrice = 100;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                break;

            case 1:
                let workerUpgrade2 = GameManager.getInstance().worker;
                workerUpgrade2.forEach(worker => {
                    worker.getComponent(Worker).vfxUpgrade.play('Upgrade');
                });
                GameManager.getInstance().speed = 1.7;

                this.btnPrice = 150;
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


