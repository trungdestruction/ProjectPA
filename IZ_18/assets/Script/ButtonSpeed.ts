import { _decorator, Component, Node, Animation } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonSpeed')
export class ButtonSpeed extends ButtonBase {
    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        if (this.countClick >= 7) {
            GameManager.getInstance().onHandlerGotoStore();
        }
        else {
            this.btnPrice += 5;
            this.label.string = this.btnPrice.toString();
            GameManager.getInstance().speedSolider += 0.5;
            let vfx = GameManager.getInstance().upgradeVfx;
            vfx.forEach(child => {
                child.getComponent(Animation).play('Upgrade');
            });
        }
        this.clickEvent();
    }
}


