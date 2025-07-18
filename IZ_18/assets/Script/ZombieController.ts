import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ZombieController')
export class ZombieController extends Component {
    @property([Prefab])
    zombie: Prefab[] = [];

    dangerZone: Node[] = [];

    private static _instance: ZombieController = null;
    public static getInstance(): ZombieController {
        return ZombieController._instance;
    }

    protected onLoad(): void {
        ZombieController._instance = this;
    }

    protected start(): void {
        for (let i = 0; i < 60; i++) {
            this.spawnZombie();
        }
        this.spawn();
    }

    spawn() {
        this.schedule(() => {
            this.spawnZombie();
        }, 0.5);
    }

    spawnZombie() {
        let zombie = instantiate(this.zombie[this.randomInt(0, this.zombie.length - 1)]);
        zombie.parent = this.node;
        let x = this.randomInt(-550, 550);
        let y = this.randomInt(-1200, -1400);
        zombie.position = new Vec3(x, y, 0);
        if (x > 0) {
            zombie.scale = new Vec3(-1, 1, 1);
        }
        else {
            zombie.scale = Vec3.ONE;
        }
    }

    kill() {
        if (this.dangerZone.length > 0) {
            let kill = this.dangerZone[0];
            this.dangerZone.shift();
            kill.destroy();
            // return true;
        }
        else {
            if (this.node.children.length == 0) return;
            this.node.children[this.randomInt(0, this.node.children.length - 1)].destroy();
            // return false;
        }
    }

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


