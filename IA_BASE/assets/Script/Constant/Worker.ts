import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Worker')
export class Worker extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    anim: Animation = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
    }
}


