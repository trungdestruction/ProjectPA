import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { Worker } from './Worker';
import { ZombieController } from './ZombieController';
const { ccclass, property } = _decorator;

@ccclass('ButtonSolider')
export class ButtonSolider extends ButtonBase {
    @property(Node)
    solider1: Node = null;

    @property(Node)
    solider2: Node = null;

    @property(Node)
    worker1: Node = null;

    @property(Node)
    worker2: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.solider1.active = true;
                ZombieController.getInstance().spawn();
                if (this.worker1.active) {
                    this.worker1.getComponentInChildren(Worker).carry();
                }

                this.btnPrice = 100;
                this.label.string = this.btnPrice.toString();

                break;

            case 1:
                this.solider2.active = true;
                ZombieController.getInstance().spawn();
                if (this.worker2.active) {
                    this.worker2.getComponentInChildren(Worker).carry();
                }

                this.btnPrice = 150;
                this.label.string = this.btnPrice.toString();

                break;

            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.clickEvent();
    }
}


