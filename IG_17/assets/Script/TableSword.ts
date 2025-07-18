import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { CustomerController } from './CustomerController';
import { Customer } from './Customer';
const { ccclass, property } = _decorator;

@ccclass('TableSword')
export class TableSword extends Component {
    @property(Node)
    cusZone: Node[] = [];

    isReady: boolean = false;
    curentCus: Customer = null;

    start() {
        this.schedule(this.selling, 0.05);
    }

    selling() {
        this.selectCus();
        if (!this.isReady || this.curentCus == null) return;
        if (this.node.children.length == 0) {
            this.isReady = false;
            return;
        }
        let lastChild = this.node.children[this.node.children.length - 1];
        tween(lastChild)
            .to(0.1, { worldPosition: this.curentCus.node.worldPosition })
            .call(() => {
                lastChild.destroy();
                if(this.curentCus == null) return;
                this.curentCus.updateOrder();
            })
            .start();
        // let delay = 0;
        // for (let i = 0; i < this.curentCus.orderNum; i++) {
        //     let sword = this.node.children[this.node.children.length - 1 - i];
        //     // console.log(sword);
            
        //     // let oldPos = sword.worldPosition;
        //     // sword.parent = this.curentCus.node;
        //     // sword.worldPosition = oldPos;
        //     tween(sword)
        //         .delay(delay)
        //         .to(0.1, { position: Vec3.ZERO })
        //         .call(() => {
        //             sword.destroy();
        //         })
        //         .start();
        //     delay += 0.05;
        // }
    }

    selectCus() {
        this.curentCus = null;
        for (let i = 0; i < this.cusZone.length; i++) {
            if (this.cusZone[i].getComponent(CustomerController).isReady) {
                this.curentCus = this.cusZone[i].getComponent(CustomerController).currentCus;
                return;
            }
        }
    }
}


