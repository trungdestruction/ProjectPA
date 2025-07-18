import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { GameManager } from '../src/GameManager';
import { ButtonBase } from '../src/ButtonBase';
import { BtnController } from '../BtnController';
const { ccclass, property } = _decorator;

@ccclass('Btn6')
export class Btn6 extends ButtonBase {
    @property(Node)
    worker: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.worker.active = true;
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


