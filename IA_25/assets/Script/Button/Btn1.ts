import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
import { Enemy } from '../Enemy';
import { EnemyController } from '../EnemyController';
import { GameManager } from '../src/GameManager';
import { BtnController } from '../BtnController';
import { ButtonBase } from '../src/ButtonBase';
const { ccclass, property } = _decorator;

@ccclass('Btn1')
export class Btn1 extends ButtonBase {
    @property(Node)
    solider: Node = null;

    protected start(): void {
        this.node.position = new Vec3(0, -1600, 0);
        tween(this.node)
            .to(0.6, { position: new Vec3(0, -850, 0) })
            .call(() => {
                this.button.enabled = true;
                this.tutHand.active = true;
            })
            .start();
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.solider.active = true;
        EnemyController.getInstance().autoSpawn();
        this.button.enabled = false;
        tween(this.node)
            .to(0.2, { scale: Vec3.ZERO })
            .call(() => {
                this.node.parent.getComponent(BtnController).click1();
                this.node.active = false;
            })
            .start();

        this.clickEvent();
    }
}


