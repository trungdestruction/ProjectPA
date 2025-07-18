import { _decorator, Component, instantiate, Node, Prefab, tween, UITransform, Vec3, Animation } from 'cc';
import { Enemy } from './Enemy';
import { Solider } from './Constant/Solider';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(Prefab)
    enemy: Prefab = null;

    @property(Animation)
    wall: Animation = null;

    dangerZone: Node[] = [];

    private static _instance: EnemyController = null;
    public static getInstance(): EnemyController {
        return EnemyController._instance;
    }

    protected onLoad(): void {
        EnemyController._instance = this;
    }

    protected start(): void {
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
    }

    autoSpawn() {
        this.schedule(this.spawnEnemy, 0.2);
    }

    spawnEnemy() {
        if (this.node.children.length > 80) return;
        let enemy = instantiate(this.enemy);
        enemy.parent = this.node;
        let x = this.getRandom(-600, 1300);
        let y = this.getRandom(-1000, -1400);

        if (x > 0) {
            enemy.getComponent(UITransform).priority = -x;
        }
        else {
            enemy.getComponent(UITransform).priority = x;
        }
        enemy.position = new Vec3(x, y, 0);
    }

    getRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    kill(solider: Node) {
        // if (this.dangerZone.length > 0) {
        //     if(solider.name == 'Solider1') {
        //         solider.getComponent(Solider).updateBullet(-1);
        //         let enemy = this.dangerZone[0];
        //         this.dangerZone.shift();
        //         enemy.getComponent(Enemy).die();
        //         return enemy;
        //     }
        // }

        // Lọc ra danh sách enemy chưa chết
        const aliveEnemies: Enemy[] = [];

        for (let i = 0; i < this.node.children.length; i++) {
            const enemy = this.node.children[i].getComponent(Enemy);
            if (enemy) {
                aliveEnemies.push(enemy);
            }
        }

        // Nếu còn enemy sống
        if (aliveEnemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
            const chosen = aliveEnemies[randomIndex];

            if (solider.name == 'Solider1') {
                solider.getComponent(Solider).updateBullet(-1);
                chosen.die();
            }
            else {
                tween(this.node)
                    .delay(0.3)
                    .call(() => {
                        chosen.die();
                    })
                    .start();
            }
            return chosen.node;
        }


    }

    killDanCoi() {
        const aliveEnemies: Enemy[] = [];

        for (let i = 0; i < this.node.children.length; i++) {
            const enemy = this.node.children[i].getComponent(Enemy);
            if (enemy) {
                aliveEnemies.push(enemy);
            }
        }

        if (aliveEnemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
            const chosen = aliveEnemies[randomIndex];
            return chosen.node;
        }
    }

}
