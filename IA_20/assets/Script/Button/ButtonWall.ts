import { _decorator, Color, Component, Label, Node, NodePool } from 'cc';
import { GameManager } from '../src/GameManager';
import { AudioManager } from '../src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonWall')
export class ButtonWall extends Component {
    @property(Label)
    label: Label = null;

    @property(Node)
    upgrade1: Node = null;

    @property(Node)
    upgrade2: Node = null;

    @property(Node)
    upgrade3: Node = null;

    @property(Node)
    wall1: Node = null;

    @property(Node)
    wall2: Node = null;

    @property(Node)
    wall3: Node = null;

    btnPrice: number = 50;
    countClick: number = 0;

    protected start(): void {
        this.label.string = this.btnPrice.toString();
    }

    updateMoney(money: number) {
        if(money < this.btnPrice){
            this.label.color = new Color(255, 0, 0);
        }
        else{
            this.label.color = new Color(255, 255, 255);
        }
    }

    click() {
        if (GameManager.getInstance().money < this.btnPrice) return;
        GameManager.getInstance().updateMoney(-this.btnPrice);
        switch (this.countClick) {
            case 0:
                this.wall1.active = false;
                this.wall2.active = true;

                this.btnPrice = 100;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                this.upgrade1.active = false;
                this.upgrade2.active = true;
                break;
            case 1:
                this.wall2.active = false;
                this.wall3.active = true;

                this.btnPrice = 150;
                this.label.string = this.btnPrice.toString();
                GameManager.getInstance().updateMoney(0);

                this.upgrade3.active = true;
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


