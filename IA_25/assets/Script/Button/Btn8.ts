import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ButtonBase } from '../src/ButtonBase';
import { GameManager } from '../src/GameManager';
import { BtnController } from '../BtnController';
import { EnemyController } from '../EnemyController';
const { ccclass, property } = _decorator;

@ccclass('Btn8')
export class Btn8 extends ButtonBase {
    @property(Node)
    roll: Node = null;

    @property(Node)
    worker: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        EnemyController.getInstance().autoSpawn();
        this.roll.active = true;
        this.worker.active = false;
        this.button.enabled = false;
        tween(this.node)
            .to(0.2, { scale: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(BtnController).activeBtn10(this.node.position);
                this.node.active = false;
            })
            .start();
    }
}


