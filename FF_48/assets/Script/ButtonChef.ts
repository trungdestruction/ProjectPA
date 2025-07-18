import { _decorator, Component, Game, game, Node, Sprite, tween, Vec3 } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { ButtonSpeed } from './ButtonSpeed';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonChef')
export class ButtonChef extends Component {
    @property(Sprite)
    cover: Sprite = null;

    @property(Node)
    btnSpeed: Node = null;

    @property(Node)
    tutHand: Node = null;

    isActive: boolean = true;
    firstClick: boolean = true;
    countClick: number = 0;

    start(): void {
        this.node.active = true;
        this.isActive = false;
        this.node.position = new Vec3(0, -930, 0);
    }

    startGame() {
        tween(this.node)
            .delay(1)
            .call(() => {
                this.isActive = true;
                this.tutHand.active = true;
            })
            .start();
    }

    click() {
        if (!this.isActive) return;
        this.isActive = false;

        this.tutHand.active = false;
        GameManager.getInstance().click(this.node);
        AudioManager.getInstance().playSoundUpgade();
        
        if (this.countClick > 2) {
            GameManager.getInstance().onHandlerGotoStore();
        }
        else {
            GameManager.getInstance().chef[this.countClick].active = true;
        }

        tween(this.cover)
            .to(0.4, { fillRange: 1 })
            .to(0.4, { fillRange: 0 })
            .call(() => {
                if (this.firstClick) {
                    this.firstClick = false;
                    tween(this.node)
                        .to(0.2, { position: new Vec3(220, -930, 0) })
                        .call(() => {
                            this.isActive = true;
                            GameManager.getInstance().isStart = true;
                        })
                        .start();
                    this.btnSpeed.active = true;
                    this.btnSpeed.getComponent(ButtonSpeed).isReady = true;
                    this.btnSpeed.scale = new Vec3(0.1, 0.1, 0.1);
                    tween(this.btnSpeed)
                        .to(0.2, { scale: new Vec3(1.2, 1.2, 1.2) })
                        .start();
                }
                else {
                    this.isActive = true;
                }
            })
            .start()
        this.countClick += 1;
    }
}


