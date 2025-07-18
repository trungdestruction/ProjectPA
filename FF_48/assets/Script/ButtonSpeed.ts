import { _decorator, Component, Node, Sprite, tween, Vec3 } from 'cc';
import { ButtonBase } from './src/ButtonBase';
import { GameManager } from './src/GameManager';
import { Chef } from './Chef';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonSpeed')
export class ButtonSpeed extends Component {
    @property(Sprite)
    cover: Sprite = null;

    isReady: boolean = false;
    isActive: boolean = true;
    countClick: number = 0;
    countTime: number = 0;

    protected start(): void {
        this.node.active = false;
    }

    click() {
        if (!this.isActive) return;
        GameManager.getInstance().click(this.node);
        AudioManager.getInstance().playSoundUpgade();

        if (this.countClick >= 6) {
            GameManager.getInstance().onHandlerGotoStore();
        }
        this.countTime = 0;
        this.isActive = false;
        GameManager.getInstance().chef.forEach(chef => {
            if (chef.active) {
                chef.getComponent(Chef).vfxUpgrade.play('Upgrade');
            }
        });
        GameManager.getInstance().speedChef += 200;
        tween(this.cover)
            .to(0.4, { fillRange: 1 })
            .to(0.4, { fillRange: 0 })
            .call(() => {
                this.isActive = true;
            })
            .start()
        this.countClick += 1;
    }
}


