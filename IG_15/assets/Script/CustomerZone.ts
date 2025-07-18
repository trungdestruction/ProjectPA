import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
import { Customer } from './Customer';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('CustomerZone')
export class CustomerZone extends Component {
    @property(Node)
    worker: Node = null;

    protected start(): void {
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].children[0].position = new Vec3(-1000, 900, 0);
            this.node.children[i].children[0].active = false;
        }
    }

    startGame() {
        let delay = 0;
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            tween(this.node)
                .delay(delay)
                .call(() => {
                    this.node.children[i].children[0].active = true;
                    this.node.children[i].children[0].getComponent(Customer).run(this.node.children[i].worldPosition);
                })
                .start();
            delay += 0.1;
        }
    }

    updateQueue() {
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            if (this.node.children[i].children.length > 0) {
                this.node.children[i].children[0].getComponent(Customer).queueing(this.node.children[i + 1]);
            }
        }
        GameManager.getInstance().customer = this.node.children[this.node.children.length - 1].children[0];
    }
}


