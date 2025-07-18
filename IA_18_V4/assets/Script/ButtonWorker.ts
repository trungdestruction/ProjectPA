import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { WorkerController } from './WorkerController';
import { BossController } from './BossController';
const { ccclass, property } = _decorator;

@ccclass('ButtonWorker')
export class ButtonWorker extends ButtonBase {
    @property(Node)
    worker1: Node = null;

    @property(Node)
    worker2: Node = null;

    @property(Node)
    machine1: Node = null;

    @property(Node)
    machine2: Node = null;

    @property(Node)
    btnSpeed: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        this.firstTuto = true;
        switch (this.countClick) {
            case 0:
                this.worker1.active = true;
                this.machine1.active = true;
                this.btnPrice = 50;
                tween(this.node)
                    .to(0.2, { position: new Vec3(200, -1000, 0) })
                    .start();

                tween(this.btnSpeed)
                    .to(0.2, { position: new Vec3(-200, -1000, 0) })
                    .start();

                break;

            case 1:
                this.worker2.active = true;
                this.machine2.active = true;
                this.btnPrice = 200;
                BossController.getInstance().scheduleAtk();
                break;

            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.clickEvent();
    }
}


