import { _decorator, Button, Color, Component, Label, Node, tween, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { AudioManager } from './AudioManager';
import globalEvent from './GlobalEvent';

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
        this.button = this.getComponent(Button);
        this.button.enabled = false;

        this.label.string = this.btnPrice.toString();

        globalEvent.on("update_money", this.updateMoney, this);
        globalEvent.on("hide_tut_hand", this.hideTutHand, this);
    }

    protected start(): void {
        GameManager.getInstance().updateMoney(0);
    }

    updateMoney(money: number) {
        if (money < this.btnPrice) {
            this.label.color = new Color(255, 0, 0);

        }
        else {
            this.label.color = new Color(255, 255, 255);
            // if (!this.firstTuto) {
            //     this.firstTuto = true;
            //     this.tutHand.active = true;
            // }
        }
    }

    clickEvent() {
        this.countClick += 1;
        GameManager.getInstance().updateMoney(0);
        this.label.string = this.btnPrice.toString();
        AudioManager.getInstance().playSoundUpgade();
    }

    hideTutHand() {
        this.tutHand.active = false;
    }
}


