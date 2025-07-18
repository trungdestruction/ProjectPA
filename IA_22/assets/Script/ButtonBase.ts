import { _decorator, Button, Color, Component, Label, Node, tween, Vec2, Vec3 } from 'cc';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Button')
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
    }

    protected start(): void {
        this.node.scale = new Vec3(0.001, 0.001, 0.001);
        tween(this.node)
            .delay(0.8)
            .to(0.3, { scale: Vec3.ONE })
            .call(() => {
                this.node.scale = Vec3.ONE;
                this.button.enabled = true;
            })
            .start();
        GameManager.getInstance().updateMoney(0);
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


