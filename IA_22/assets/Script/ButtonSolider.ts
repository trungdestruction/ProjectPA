import { _decorator, Button, Component, Node, tween } from 'cc';
import { ButtonBase } from './ButtonBase';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;

@ccclass('ButtonSolider')
export class ButtonSolider extends ButtonBase {
    @property(Node)
    solider1: Node = null;

    @property(Node)
    solider2: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.solider1.active = true;

                this.btnPrice = 60;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);
                EnemyController.getInstance().spawnCar();
                // EnemyController.getInstance().spawn();
                break;

            case 1:
                this.solider2.active = true;

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


