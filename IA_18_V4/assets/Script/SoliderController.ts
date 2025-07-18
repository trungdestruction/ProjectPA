import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { OrderPos } from './OrderPos';
import { Solider } from './Constant/Solider';
const { ccclass, property } = _decorator;

@ccclass('SoliderController')
export class SoliderController extends Component {
    @property(Node)
    orderPos: Node[] = [];

    @property(Node)
    waitingPos: Node[] = [];

    @property(Node)
    battleZone: Node = null;

    @property(Prefab)
    soliderPrefab: Prefab = null;

    soliderArr: Node[] = [];

    private static _instance: SoliderController = null;
    public static getInstance(): SoliderController {
        return SoliderController._instance;
    }

    protected onLoad(): void {
        SoliderController._instance = this;
    }

    spawn(parent: Node) {
        let solider = instantiate(this.soliderPrefab);
        solider.parent = parent;
        solider.position = new Vec3(800, 0, 0);
        solider.getComponent(Solider).run(parent, false);
    }

    serving() {
        for (let i = 0; i < this.orderPos.length; i++) {
            if (this.orderPos[i].getComponent(OrderPos).ready) {
                return this.orderPos[i];
            }
        }
    }

    checkEmpty(): number {
        let ran = Math.floor(Math.random() * (this.battleZone.children.length - 1));
        if (this.battleZone.children[ran].children.length > 0) {
            return this.checkEmpty();
        }
        else {
            return ran;
        }
    }
}


