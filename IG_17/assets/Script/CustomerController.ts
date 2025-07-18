import { _decorator, Component, instantiate, Node, Prefab, tween, v3, Vec3 } from 'cc';
import { Customer } from './Customer';
const { ccclass, property } = _decorator;

@ccclass('CustomerController')
export class CustomerController extends Component {
    @property(Prefab)
    char: Prefab[] = [];

    isReady: Boolean = false;
    currentCus: Customer = null;

    protected start(): void {
        this.spawnChar();
    }

    spawnChar() {
        let charSpawn = instantiate(this.char[Math.floor(Math.random() * this.char.length)]);
        charSpawn.parent = this.node;
        charSpawn.position = v3(1850, 1065, 0);
        this.currentCus = charSpawn.getComponent(Customer);
    }

}


