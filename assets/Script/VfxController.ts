import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VfxController')
export class VfxController extends Component {
    protected start(): void {
        let delay = 0;
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            tween(this.node)
                .delay(delay)
                .call(() => {
                    this.node.children[i].active = true;
                })
                .start();
            delay += 0.05;
        }
    }
}


