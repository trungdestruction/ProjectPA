import { _decorator, Color, Component, Label, Node, SpriteFrame } from 'cc';
import { GameManager } from '../src/GameManager';
import { Worker } from '../Worker';
import { AudioManager } from '../src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonWorker')
export class ButtonWorker extends Component {
    @property(Label)
    label: Label = null;

    @property(Node)
    upgrade1: Node = null;

    @property(Node)
    upgrade2: Node = null;

    @property(Node)
    upgrade3: Node = null;

    @property([Node])
    worker: Node[] = [];

    @property([Node])
    conveyorr: Node[] = [];

    @property(Node)
    upgradeVfx: Node = null;

    btnPrice: number = 30;
    countClick: number = 0;

    protected start(): void {
        this.label.string = this.btnPrice.toString();
    }

    updateMoney(money: number) {
        if (money < this.btnPrice) {
            this.label.color = new Color(255, 0, 0);
        }
        else {
            this.label.color = new Color(255, 255, 255);
        }
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.worker[0].active = true;
                this.worker[1].active = true;

                this.btnPrice = 50;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                this.upgrade1.active = false;
                this.upgrade2.active = true;
                break;
            case 1:
                this.upgradeVfx.active = true;
                this.worker[0].getComponent(Worker).timeMove = 0.8;
                this.worker[1].getComponent(Worker).timeMove = 0.8;

                this.btnPrice = 100;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                this.upgrade2.active = false;
                this.upgrade3.active = true;
                break;
            case 2:
                this.worker[0].active = false;
                this.worker[1].active = false;
                this.conveyorr[0].active = true;
                this.conveyorr[1].active = true;

                this.btnPrice = 200;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                break;
            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.countClick += 1;
        GameManager.getInstance().hideAllTut();
        AudioManager.getInstance().playSoundUpgade();
    }
}


