import { _decorator, Component, Node } from 'cc';
import { ButtonBase } from '../src/ButtonBase';
import { GameManager } from '../src/GameManager';
import { LineController } from '../LineController';
import { BoatController } from '../BoatController';
const { ccclass, property } = _decorator;

@ccclass('ButtonBoat')
export class ButtonBoat extends ButtonBase {
    @property(Node)
    boatController: Node = null;

    protected start(): void {
        this.node.children[1].active = false;
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);

        this.boatController.getComponent(BoatController).unlockBoat();

        this.clickEvent();
    }
}


