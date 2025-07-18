import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ButtonBase } from '../src/ButtonBase';
import { Solider } from '../Constant/Solider';
import { GameManager } from '../src/GameManager';
import { BtnController } from '../BtnController';
import { EnemyController } from '../EnemyController';
const { ccclass, property } = _decorator;

@ccclass('Btn4')
export class Btn4 extends ButtonBase {
    @property(Node)
    solider: Node = null;

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.solider.getComponent(Solider).speed = 1;
        this.solider.getComponent(Solider).vfxUpgrade.play('Upgrade');
        EnemyController.getInstance().autoSpawn();
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


