import { _decorator, Button, Color, Component, Label, Node, tween, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonBase')
export class ButtonBase extends Component {
    @property(Label)
    label: Label = null;

    @property(Node)
    tutHand: Node = null;

    @property(Number)
    btnPrice: number = 100;

    firstTuto: boolean = false;
    countClick: number = 0;
    button: Button = null;

    private static _instance: ButtonBase = null;
    public static getInstance(): ButtonBase {
        return ButtonBase._instance;
    }

    protected onLoad(): void {
        ButtonBase._instance = this;

        this.label.string = this.btnPrice.toString();
        this.updateMoney(GameManager.getInstance().money);
    }

    protected start(): void {

    }

    updateMoney(money: number) {
        if (money < this.btnPrice) {
            this.label.color = new Color(255, 0, 0);

        }
        else {
            this.label.color = new Color(255, 255, 255);
            if (!this.firstTuto) {
                this.firstTuto = true;
                this.tutHand.active = true;
            }
        }
    }

    clickEvent() {
        this.countClick += 1;
        GameManager.getInstance().countStore();
        GameManager.getInstance().hideAllTut();
        AudioManager.getInstance().playSoundUpgade();
    }
}


