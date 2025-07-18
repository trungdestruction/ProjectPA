import { _decorator, Button, Color, Component, Label, Node, tween, Vec2, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { AudioManager } from './AudioManager';
import globalEvent from './GlobalEvent';

const { ccclass, property } = _decorator;

@ccclass('ButtonBase')
export class ButtonBase extends Component {
    @property(Label)
    label: Label = null;

    @property(Number)
    btnPrice: number = 10;

    firstTuto: boolean = false;
    countClick: number = 0;
    button: Button = null;
    clicked: boolean = false;

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
        globalEvent.on("start_game", this.startGame, this);
    }

    protected start(): void {
        GameManager.getInstance().updateMoney(0);
    }

    startGame() {
        this.button.enabled = true;
        this.node.children[1].active = true;
    }

    updateMoney(money: number) {
        if (money < this.btnPrice) {
            this.label.color = new Color(255, 0, 0);

        }
        else {
            this.label.color = new Color(255, 255, 255);
            if (!this.clicked) {
                GameManager.getInstance().showTutHand(this.node.worldPosition);
            }

            // if (!this.firstTuto) {
            //     this.firstTuto = true;
            //     GameManager.getInstance().showTutHand(this.node.worldPosition);
            // }
        }
    }

    clickEvent() {
        this.countClick += 1;
        this.clicked = true;
        GameManager.getInstance().updateMoney(0);
        GameManager.getInstance().tutHand.active = false;
        this.label.string = this.btnPrice.toString();
        AudioManager.getInstance().playSoundUpgade();
        GameManager.getInstance().clickToStore();
    }
}


