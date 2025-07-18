import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { Worker } from './Constant/Worker';
const { ccclass, property } = _decorator;

@ccclass('ButtonSpeed')
export class ButtonSpeed extends ButtonBase {
    @property(Node)
    worker: Node[] = [];

    protected start(): void {
        this.node.active = false;
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.worker.forEach(worker => {
            if (worker.active) {
                worker.getComponent(Worker).vfxUpgrade.play('Upgrade');
            }
        });
        // this.btnPrice += 5;
        if(this.countClick <= 1){
            GameManager.getInstance().speed += 0.5;
        }
        else{
            GameManager.getInstance().speed += 0.2;
        }
        this.clickEvent();
        if (this.countClick >= 10) {
            GameManager.getInstance().onHandlerGotoStore();
        }
    }
}


