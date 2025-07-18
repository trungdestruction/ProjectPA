import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ButtonBase } from '../src/ButtonBase';
import { GameManager } from '../src/GameManager';
import { LineController } from '../LineController';
import { BtnController } from '../BtnController';
const { ccclass, property } = _decorator;

@ccclass('Btn7')
export class Btn7 extends ButtonBase {
    @property(Node)
    line: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.line.getComponent(LineController).activeRoll();
        this.button.enabled = false;
        tween(this.node)
            .to(0.2, { scale: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(BtnController).activeBtn9(this.node.position);
                this.node.active = false;
            })
            .start();

        this.clickEvent();
    }
}


