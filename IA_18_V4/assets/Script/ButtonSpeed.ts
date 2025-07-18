import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { WorkerController } from './WorkerController';
import { Worker } from './Constant/Worker';
import { BossController } from './BossController';
const { ccclass, property } = _decorator;

@ccclass('ButtonSpeed')
export class ButtonSpeed extends ButtonBase {
    @property(Node)
    worker: Node[] = [];

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.firstTuto = true;
        if (this.countClick == 3) {
            BossController.getInstance().scheduleAtk();
        }
        if (this.countClick >= 5) {
            GameManager.getInstance().onHandlerGotoStore();
        }

        this.worker.forEach(worker => {
            if (worker.active) {
                worker.getComponent(Worker).vfxUpgrade.play('Upgrade');
            }
        });
        this.btnPrice += 5;
        WorkerController.getInstance().timeProgress = WorkerController.getInstance().timeProgress * 0.8;

        this.clickEvent();
    }
}


