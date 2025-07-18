import { _decorator, Component, instantiate, Node, Vec3 } from 'cc';
import { Solider } from './Constant/Solider';
import { SoliderController } from './SoliderController';
const { ccclass, property } = _decorator;

@ccclass('OrderPos')
export class OrderPos extends Component {
    @property(Node)
    waitingPos: Node = null;

    ready: boolean = false;

    protected start(): void {
        let solider = instantiate(SoliderController.getInstance().soliderPrefab);
        solider.parent = this.node;
        solider.position = new Vec3(800, 0, 0);
        solider.getComponent(Solider).anim.play('Run90');
        solider.getComponent(Solider).run(this.node, true);

        SoliderController.getInstance().spawn(this.waitingPos);
    }

    order() {
        this.node.children[0].getComponent(Solider).toBattleZone();

        this.waitingPos.children[0].getComponent(Solider).run(this.node, true);
        SoliderController.getInstance().spawn(this.waitingPos);
    }
}


