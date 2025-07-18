import { _decorator, Component, easing, instantiate, Node, Prefab, tween, UITransform, Vec3, Animation } from 'cc';
import { Enemy } from './Enemy';
import { GameManager } from './src/GameManager';
import { Solider } from './Solider';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(Node)
    car: Node = null;

    @property(Node)
    wall: Node = null;

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
        this.car.active = false;
    }

    firstSpawn() {
        this.car.active = true;
        this.car.position = new Vec3(1200, 2400, 0);
        tween(this.car)
            .to(1.2, { position: new Vec3(0, 700, 0) }, { easing: easing.quadOut })
            .call(() => {
                this.spawnEnemy();
                this.schedule(() => {
                    this.spawnEnemy();
                }, 0.5, 1);
                this.scheduleOnce(() => {
                    this.wall.getComponent(Animation).play('WallMap');
                }, 1)
            })
            .start();
    }

    spawn() {
        this.schedule(() => {
            this.spawnEnemy();
        }, 0.7)
    }

    spawnEnemy() {
        if (this.node.children.length >= 10) return;
        let enemy = instantiate(this.enemy);
        enemy.parent = this.node;
        // let ran1 = this.createRandomNoRepeatLast5(-400, 400, 100);
        // let ran2 = this.createRandomNoRepeatLast5(100, 400, 100);
        // let x = ran1();
        // let y = ran2();
        let x = this.randomInt(-400, 400);
        let y = this.randomInt(100, 350);
        enemy.getComponent(UITransform).priority = 350 - y;
        enemy.position = new Vec3(30, 600, 0);
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
            solider.getComponent(Solider).updateBullet(-1);
            GameManager.getInstance().spawnVfxSplash(chosen.node.worldPosition);
            chosen.isDead = true;
            chosen.die();
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

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


