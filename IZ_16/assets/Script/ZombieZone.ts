import { _decorator, Component, instantiate, Node, Prefab, sp, Vec2, Vec3 } from 'cc';
import { Zombie } from './Zombie';
const { ccclass, property } = _decorator;

@ccclass('ZombieZone')
export class ZombieZone extends Component {

    @property(Boolean)
    upZone: boolean = false;

    @property([Prefab])
    zombie: Prefab[] = [];

    speed: number = 3;

    protected start(): void {
        this.spawnZombie();
        this.spawnZombie();
        this.spawnZombie();
        this.spawnZombie();
        this.spawnZombie();
        this.schedule(() => {
            this.spawnZombie();
            this.spawnZombie();
        }, 1);
    }

    spawnZombie() {
        if (this.node.children.length > 30) return;
        let ran = Math.floor(Math.random() * this.zombie.length);
        let zom = instantiate(this.zombie[ran]);
        if (this.upZone) {
            this.node.insertChild(zom, 0);
        }
        else {
            zom.parent = this.node;
        }
        let x = Math.floor(Math.random() * (210 + 275)) - 275;
        zom.position = new Vec3(x, 0, 0);
        if (this.upZone) {
            zom.getComponent(Zombie).moveSpeed = -3;
        }
        else {
            zom.getComponent(Zombie).moveSpeed = 3;
        }
    }
}


