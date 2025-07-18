import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoDestroy')
export class AutoDestroy extends Component {
    @property(Number)
    time: number = 0;

    start() {
        tween(this.node)
            .delay(this.time)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


