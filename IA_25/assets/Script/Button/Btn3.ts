import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { GameManager } from '../src/GameManager';
import { ButtonBase } from '../src/ButtonBase';
import { BtnController } from '../BtnController';
import { WorkerDanCoi } from '../WorkerDanCoi';
const { ccclass, property } = _decorator;

@ccclass('Btn3')
export class Btn3 extends ButtonBase {
    @property(Node)
    solider: Node = null;
    @property(Node)
    worker: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.solider.active = true;
        if (this.worker.active) {
            this.worker.getComponent(WorkerDanCoi).carrying();
        }
        this.button.enabled = false;
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


