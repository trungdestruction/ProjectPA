import { _decorator, Component, Node, random, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Character extends Component {
    @property(Node)
    popUpCau: Node = null;

    @property(Node)
    popUpVui: Node = null;

    @property(Node)
    popUp: Node = null;

    showPopUpCau() {
        this.popUpCau.active = true;
        this.popUpCau.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.popUpCau)
            .to(0.1, { scale: Vec3.ONE })
            .start();
    }

    showPopUpVui() {
        this.popUpCau.active = false;
        this.popUpVui.active = true;
        this.popUpVui.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.popUpVui)
            .to(0.1, { scale: Vec3.ONE })
            .delay(0.5)
            .to(0.1, { scale: new Vec3(0.1, 0.1, 0.1) })
            .call(()=>{
                this.popUp.active = false;
            })
            .start();
    }
}


