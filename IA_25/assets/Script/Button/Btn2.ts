import { _decorator, Color, Component, Node, tween, Vec3 } from 'cc';
import { ButtonBase } from '../src/ButtonBase';
import { GameManager } from '../src/GameManager';
import { BtnController } from '../BtnController';
const { ccclass, property } = _decorator;

@ccclass('Btn2')
export class Btn2 extends ButtonBase {
    @property(Node)
    worker: Node = null;

    protected start(): void {
        
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.worker.active = true;
        this.button.enabled = false;
        tween(this.node)
            .to(0.2, { scale: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(BtnController).click2();
                this.node.active = false;
            })
            .start();

        this.clickEvent();
    }
}


