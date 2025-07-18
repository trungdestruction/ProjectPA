import { _decorator, Component, instantiate, Node, Prefab, sp, tween, UITransform, Vec3 } from 'cc';
import { Enemy } from './Enemy';
import { Solider } from './Solider';
import { SoliderRocket } from './SoliderRocket';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(Prefab)
    enemy: Prefab = null;

    private static _instance: EnemyController = null;
    public static getInstance(): EnemyController {
        return EnemyController._instance;
    }

    protected onLoad(): void {
        EnemyController._instance = this;
    }

    protected start(): void {
        this.spawn();
    }


    spawn() {
        this.schedule(() => {
            this.spawnEnemy();
        }, 0.12);
    }

    spawnEnemy() {
        // if (this.node.children.length >= 10) return;
        let enemy = instantiate(this.enemy);
        enemy.parent = this.node;
        let ran1 = this.createRandomNoRepeatLast5(400, 500, 10);
        let ran2 = this.createRandomNoRepeatLast5(-400, 250, 10);
        let x = ran1();
        let y = ran2();
        enemy.getComponent(UITransform).priority = 300 - y;
        // enemy.setSiblingIndex(30 - y/10);
        enemy.position = new Vec3(800, y, 0);
        enemy.getComponent(Enemy).run(new Vec3(x, y, 0));
    }

    kill(solider: Node) {
        // Lọc ra danh sách enemy chưa chết
        const aliveEnemies: Enemy[] = [];

        for (let i = 0; i < this.node.children.length; i++) {
            const enemy = this.node.children[i].getComponent(Enemy);
            if (enemy && !enemy.isDead) {
                aliveEnemies.push(enemy);
            }
        }

        // Nếu còn enemy sống
        if (aliveEnemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
            const chosen = aliveEnemies[randomIndex];

            if (solider.name == 'Solider1') {
                solider.getComponent(Solider).updateBullet(-1);
                GameManager.getInstance().spawnVfxSplash(chosen.node.worldPosition);
                chosen.isDead = true;
                chosen.die();
            }
            else {
                chosen.isDead = true;
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

    createRandomNoRepeatLast5(min: number, max: number, step: number) {
        const values: number[] = [];
        for (let i = min; i <= max; i += step) {
            values.push(i);
        }

        const recent: number[] = [];

        function isInRecent(value: number): boolean {
            for (let i = 0; i < recent.length; i++) {
                if (recent[i] === value) return true;
            }
            return false;
        }

        return function (): number {
            const available: number[] = [];
            for (let i = 0; i < values.length; i++) {
                if (!isInRecent(values[i])) {
                    available.push(values[i]);
                }
            }

            if (available.length === 0) {
                recent.length = 0; // reset
                return arguments.callee(); // gọi lại chính hàm
            }

            const index = Math.floor(Math.random() * available.length);
            const result = available[index];

            recent.push(result);
            if (recent.length > 5) {
                recent.shift();
            }

            return result;
        };
    }
}


