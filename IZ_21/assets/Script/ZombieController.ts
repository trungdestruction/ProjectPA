import { _decorator, Component, instantiate, Node, Prefab, UITransform, Vec2, Vec3 } from 'cc';
import { Zombie } from './Zombie';
import globalEvent from './src/GlobalEvent';
const { ccclass, property } = _decorator;

@ccclass('ZombieController')
export class ZombieController extends Component {
    @property(Prefab)
    zombie: Prefab[] = [];

    @property(Boolean)
    inverse: boolean = false;

    protected onLoad(): void {
        globalEvent.on("start_game", this.startGame, this);
    }

    startGame() {
        this.schedule(() => {
            if (this.node.children.length < 20) {
                this.spawn();
            }
        }, 0.5);
    }

    spawn() {
        let zombie = instantiate(this.zombie[this.randomInt(0, this.zombie.length - 1)]);
        zombie.parent = this.node;
        let x = this.randomInt(300, 400);
        let y = this.randomInt(-1250, -300);
        zombie.position = new Vec3(x, y, 0);
        zombie.getComponent(UITransform).priority = -y;
        if (this.inverse) {
            zombie.getComponent(Zombie).moveDir = new Vec2(1, 0);
        }
        // if (x > 0) {
        //     zombie.scale = new Vec3(-1, 1, 1);
        // }
        // else {
        //     zombie.scale = Vec3.ONE;
        // }
    }

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


