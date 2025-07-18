import { _decorator, Color, Component, Label, Node, SpriteFrame } from 'cc';
import { GameManager } from '../src/GameManager';
import { Solider } from '../Solider';
import { EnemyController } from '../EnemyController';
import { AudioManager } from '../src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonTower')
export class ButtonTower extends Component {
    @property(Label)
    label: Label = null;

    @property(Node)
    upgrade1: Node = null;

    @property(Node)
    upgrade2: Node = null;

    @property(Node)
    tower1: Node = null;

    @property(Node)
    solider1: Node = null;

    @property(Node)
    line2: Node = null;

    @property(Node)
    upgradeVfx: Node = null;

    btnPrice: number = 50;
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
                this.tower1.active = true;
                EnemyController.getInstance().spawn();
                GameManager.getInstance().firstClick();

                this.btnPrice = 100;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                this.upgrade1.active = true;
                this.upgrade2.active = false;

                break;

            case 1:
                this.line2.active = true;
                EnemyController.getInstance().spawn();

                this.btnPrice = 200;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                break;

            // case 2:
            //     this.line2.active = true;
            //     break;

            default:
                GameManager.getInstance().onHandlerGotoStore();
                break;
        }
        this.countClick += 1;
        GameManager.getInstance().hideAllTut();
        AudioManager.getInstance().playSoundUpgade();
    }
}


