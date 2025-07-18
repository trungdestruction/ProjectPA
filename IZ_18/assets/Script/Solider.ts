import { _decorator, Component, Node, Animation, Vec2, Vec3 } from 'cc';
import { GameManager } from './src/GameManager';
import { ZombieController } from './ZombieController';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {
    @property(Node)
    graphic: Node = null;

    anim: Animation = null;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }

    protected start(): void {
        this.scheduleOnce(()=>{
            this.shoot();
        }, 1);
    }

    shoot() {
        AudioManager.getInstance().playSoundGun();
        let duration = 1;
        let speed = GameManager.getInstance().speedSolider;
        let stateAtk = this.anim.getState('AtkDown');
        stateAtk.speed = speed * 0.3;
        this.anim.play('AtkDown');
        ZombieController.getInstance().kill();
        // if (ZombieController.getInstance().kill()) {
        //     this.node.scale = new Vec3(-1, 1, 0);
        // }
        // else{
        //     this.node.scale = Vec3.ONE;
        // }
        this.scheduleOnce(() => {
            this.shoot();
        }, duration / speed)
    }
}


