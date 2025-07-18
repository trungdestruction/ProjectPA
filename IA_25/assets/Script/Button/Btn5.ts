import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { GameManager } from '../src/GameManager';
import { ButtonBase } from '../src/ButtonBase';
import { Worker } from '../Constant/Worker';
import { WorkerDanCoi } from '../WorkerDanCoi';
import { BtnController } from '../BtnController';
const { ccclass, property } = _decorator;

@ccclass('Btn5')
export class Btn5 extends ButtonBase {
    @property(Node)
    worker1: Node = null;

    @property(Node)
    worker2: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        GameManager.getInstance().speed = 600;
        this.worker1.getComponent(Worker).vfxUpgrade.play('Upgrade');
        if (this.worker2.active) {
            this.worker2.getComponent(WorkerDanCoi).vfxUpgrade.play('Upgrade');
        }

        tween(this.node)
            .to(0.2, { scale: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(BtnController).click3(this.node.position);
                this.node.active = false;
            })
            .start();

        this.clickEvent();
    }
}


