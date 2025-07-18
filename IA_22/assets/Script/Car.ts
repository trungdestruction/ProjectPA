import { _decorator, Component, Label, Node, Sprite, Animation, SpriteFrame, tween, Prefab, instantiate, Vec3 } from 'cc';
import { EnemyController } from './EnemyController';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Car')
export class Car extends Component {
    @property(Node)
    hpBar: Node = null;

    @property(Node)
    explode: Node = null;

    @property(SpriteFrame)
    brockenCar: SpriteFrame = null;

    @property(Prefab)
    vfxBullet: Prefab = null;

    hp: number = 500;
    currentHp: number = 0;

    showHpBar(hp: number) {
        this.hpBar.active = true;
        this.hp = hp;
        this.currentHp = this.hp;
        this.hpBar.getComponentInChildren(Label).string = this.currentHp + '/' + this.hp;
    }

    takeDame() {
        this.currentHp -= 100;
        this.hpBar.getComponentInChildren(Sprite).fillRange -= 100 / this.hp;
        this.hpBar.getComponentInChildren(Label).string = this.currentHp + '/' + this.hp;
        this.spawnVfx();
        this.spawnVfx();
        this.spawnVfx();
        this.spawnVfx();
        this.spawnVfx();

        if (this.currentHp == 0) {
            GameManager.getInstance().spawnCoin2(this.node.worldPosition);
            EnemyController.getInstance().spawnCar();
            this.explode.active = true;
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.5);
        }
    }

    spawnVfx() {
        let vfx = instantiate(this.vfxBullet);
        vfx.parent = this.node;
        vfx.scale = new Vec3(2, 2, 2);
        vfx.eulerAngles = new Vec3(this.randomInt(0, 360), 0, 0);
        let pos = this.randomInt(-100, 100);
        vfx.position = new Vec3(pos, pos, 0);
        this.scheduleOnce(() => {
            vfx.destroy();
        }, 0.2)
    }

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


