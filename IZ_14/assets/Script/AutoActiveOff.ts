import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoActiveOff')
export class AutoActiveOff extends Component {

    protected onEnable(): void {
        this.scheduleOnce(() => {
            this.node.active = false;
        }, 0.5);
    }
}


