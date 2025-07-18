import { _decorator, Component, instantiate, Node, Prefab, random, Vec3 } from 'cc';
import { Customer } from './Customer';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('CustomerController')
export class CustomerController extends Component {
    @property(Prefab)
    cus: Prefab[] = [];

    @property(Node)
    inRes: Node = null;

    @property(Node)
    pos1: Node = null;

    @property(Node)
    pos2: Node = null;

    startGame(): void {
        let x = -800;
        for (let i = 11; i >= 0; i--) {
            let ran = Math.floor(Math.random() * this.cus.length);
            let cusSpawn = instantiate(this.cus[ran]);
            cusSpawn.parent = this.node;
            cusSpawn.position = new Vec3(x - 150 * i, 700, 0);
            cusSpawn.getComponent(Customer).moveToEndPos(this.pos1.position, this.pos2.position, this.queue(i));
            if (i == 2) {
                GameManager.getInstance().cus3 = cusSpawn;
            }
            if (i == 1) {
                GameManager.getInstance().cus2 = cusSpawn;
            }
            if (i == 0) {
                GameManager.getInstance().cus1 = cusSpawn;
            }
        }
    }

    queue(slot: number) {
        let queueX = -500;
        let queueY = 50;
        let row = Math.floor(slot / 6);
        let col = slot % 6;
        return new Vec3(queueX + 200 * (col), queueY + 250 * (row), 0);
    }
}


