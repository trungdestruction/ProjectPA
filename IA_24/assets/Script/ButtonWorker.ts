import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { ButtonSpeed } from './ButtonSpeed';
const { ccclass, property } = _decorator;

@ccclass('ButtonWorker')
export class ButtonWorker extends ButtonBase {
    @property(Node)
    worker1: Node = null;

    @property(Node)
    worker2: Node = null;

    @property(Node)
    worker3: Node = null;

    @property(Node)
    btnSpeed: Node = null;

    protected start(): void {
        this.node.position = new Vec3(0, -1600, 0);
        this.scheduleOnce(() => {
            tween(this.node)
                .to(0.5, { position: new Vec3(0, -900, 0) })
                .call(() => {
                    this.button.enabled = true;
                    this.tutHand.active = true;
                })
                .start();
        }, 1)
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.worker1.active = true;
                this.btnPrice = 20;

                tween(this.node)
                    .to(0.2, { position: new Vec3(200, -900, 0) })
                    .start();

                this.btnSpeed.active = true;
                this.btnSpeed.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.btnSpeed)
                    .to(0.2, { scale: Vec3.ONE })
                    .call(() => {
                        this.btnSpeed.getComponent(ButtonSpeed).button.enabled = true;
                    })
                    .start();
                break;
            case 1:
                this.worker2.active = true;
                this.btnPrice = 50;
                break;
            case 2:
                this.worker3.active = true;
                this.btnPrice = 100;
                break;
            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.clickEvent();
    }
}


