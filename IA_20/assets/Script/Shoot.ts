import { _decorator, Component, Node } from 'cc';
import { Solider } from './Solider';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;

@ccclass('Shoot')
export class Shoot extends Component {
    solider: Solider = null;

    protected start(): void {
        this.solider = this.node.parent.getComponent(Solider);
    }

    shoot() {
        if (this.solider.enemyZone.children.length > 0 && this.solider.bullet > 0) {
            this.solider.updateBullet(-1);
            this.solider.enemyZone.children[0].getComponent(Enemy).die();
        }
        else {
            this.solider.anim.play('Idle');
            this.solider.shooting = false;
        }
    }

    idle() {
        if (this.solider.bullet == 0) {
            this.solider.anim.play('Idle');
            this.solider.shooting = false;
        }
    }
}


