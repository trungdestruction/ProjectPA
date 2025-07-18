import { _decorator, Component, Node, tween } from 'cc';
import { Solider } from './Solider';
import { SoliderRocket } from './SoliderRocket';
const { ccclass, property } = _decorator;

@ccclass('ConveyorBox')
export class ConveyorBox extends Component {
    @property(Node)
    box1: Node = null;

    @property(Node)
    box2: Node = null;

    @property(Boolean)
    rocket: boolean = false;

    @property(Node)
    solider: Node = null;

    protected onEnable(): void {
        this.box1.active = true;
        this.scheduleOnce(() => {
            this.box2.active = true;
        }, 0.5);
        tween(this.node)
            .delay(0.5)
            .call(() => {
                this.schedule(() => {
                    if(!this.rocket){
                        this.solider.getComponent(Solider).updateBullet(4);
                    }
                    else{
                        this.solider.getComponent(SoliderRocket).updateBullet(2);
                    }
                }, 1);
            })
            .start();
    }
}


