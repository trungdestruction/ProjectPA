import { _decorator, Component, easing, instantiate, Node, Prefab, tween, UITransform, Vec3, Animation } from 'cc';
import { Enemy } from './Enemy';
import { GameManager } from './src/GameManager';
import { Solider } from './Solider';
import { Car } from './Car';
const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {
    @property(Node)
    carPos: Node = null;

    @property(Prefab)
    car: Prefab = null;

    @property(Node)
    wall: Node = null;

    @property(Prefab)
    enemy: Prefab = null;

    currentCar: Node = null;
    hpCar: number = 500;
    firstSpawn: boolean = false;

    private static _instance: EnemyController = null;
    public static getInstance(): EnemyController {
        return EnemyController._instance;
    }

    protected onLoad(): void {
        EnemyController._instance = this;
    }

    protected start(): void {

    }

    spawnCar() {
        this.currentCar = null;
        let car = instantiate(this.car);
        car.parent = this.carPos;
        car.position = new Vec3(0, 1600, 0);
        tween(car)
            .delay(1)
            .to(1.2, { position: new Vec3(0, 500, 0) }, { easing: easing.quadOut })
            .call(() => {
                this.currentCar = car;
                this.currentCar.getComponent(Car).showHpBar(this.hpCar);
                this.hpCar += this.hpCar;
                // this.spawnEnemy();
                // this.schedule(() => {
                //     this.spawnEnemy();
                // }, 0.5);
                if (!this.firstSpawn) {
                    this.firstSpawn = true;
                    this.spawn();
                }
            })
            .start();

    }

    spawn() {
        this.schedule(() => {
            this.spawnBurst(2, 0.5);
        }, 2)
    }

    spawnBurst(count: number, interval: number) {
        let i = 0;

        const spawnOne = () => {
            this.spawnEnemy(); // Cậu thay bằng tạo prefab hoặc logic của cậu
            i++;
            if (i < count) {
                this.scheduleOnce(spawnOne, interval);
            }
        };

        spawnOne(); // bắt đầu chuỗi spawn
    }

    spawnEnemy() {
        if (this.node.children.length >= 10) return;
        let enemy = instantiate(this.enemy);
        enemy.parent = this.node;
        // let ran1 = this.createRandomNoRepeatLast5(-400, 400, 100);
        // let ran2 = this.createRandomNoRepeatLast5(100, 400, 100);
        // let x = ran1();
        // let y = ran2();
        let x = 0;
        let y = this.randomInt(100, 350);
        enemy.getComponent(UITransform).priority = 350 - y;
        let result = Math.random() < 0.5;
        if (result) {
            enemy.position = new Vec3(210, 450, 0);
            x = this.randomInt(200, 400);
        }
        else {
            enemy.position = new Vec3(-210, 450, 0);
            x = this.randomInt(-400, -200);
        }
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
        else {
            if (this.currentCar != null) {
                solider.getComponent(Solider).updateBullet(-1);
                this.currentCar.getComponent(Car).takeDame();
            }
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


