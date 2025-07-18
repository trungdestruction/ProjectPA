import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ButtonBase } from './src/ButtonBase';
const { ccclass, property } = _decorator;

@ccclass('BtnController')
export class BtnController extends Component {
    @property(Node)
    btn2: Node = null;

    @property(Node)
    btn3: Node = null;

    @property(Node)
    btn4: Node = null;

    @property(Node)
    btn5: Node = null;

    @property(Node)
    btn6: Node = null;

    @property(Node)
    btn7: Node = null;

    @property(Node)
    btn8: Node = null;

    @property(Node)
    btn9: Node = null;

    @property(Node)
    btn10: Node = null;

    afterClick3: boolean = false;

    click1() {
        this.btn2.active = true;
        this.btn2.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.btn2)
            .to(0.2, { scale: Vec3.ONE })
            .call(() => {
                this.btn2.getComponent(ButtonBase).button.enabled = true;
                this.btn2.getComponent(ButtonBase).tutHand.active = true;
            })
            .start();

        this.btn4.active = true;
        this.btn4.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.btn4)
            .to(0.2, { scale: Vec3.ONE })
            .call(() => {
                this.btn4.getComponent(ButtonBase).button.enabled = true;
            })
            .start();
    }

    click2() {
        this.btn5.active = true;
        this.btn5.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.btn5)
            .to(0.2, { scale: Vec3.ONE })
            .call(() => {
                this.btn5.getComponent(ButtonBase).button.enabled = true;
            })
            .start();
    }

    click3(pos: Vec3) {
        if (!this.afterClick3) {
            if (!this.btn3.active) {
                this.btn3.active = true;
                this.btn3.position = pos;
                this.btn3.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.btn3)
                    .to(0.2, { scale: Vec3.ONE })
                    .call(() => {
                        this.btn3.getComponent(ButtonBase).button.enabled = true;
                    })
                    .start();
            }
            else {
                this.btn6.active = true;
                this.afterClick3 = true;
                this.btn6.position = pos;
                this.btn6.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.btn6)
                    .to(0.2, { scale: Vec3.ONE })
                    .call(() => {
                        this.btn6.getComponent(ButtonBase).button.enabled = true;
                    })
                    .start();
            }
        }
        else {
            if (!this.btn7.active) {
                this.btn7.active = true;
                this.btn7.position = pos;
                this.btn7.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.btn7)
                    .to(0.2, { scale: Vec3.ONE })
                    .call(() => {
                        this.btn7.getComponent(ButtonBase).button.enabled = true;
                    })
                    .start();
            }
            else {
                this.btn8.active = true;
                this.btn8.position = pos;
                this.btn8.scale = new Vec3(0.1, 0.1, 0.1);
                tween(this.btn8)
                    .to(0.2, { scale: Vec3.ONE })
                    .call(() => {
                        this.btn8.getComponent(ButtonBase).button.enabled = true;
                    })
                    .start();
            }
        }
    }

    activeBtn9(pos: Vec3) {
        this.btn9.active = true;
        this.btn9.position = pos;
        this.btn9.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.btn9)
            .to(0.2, { scale: Vec3.ONE })
            .call(() => {
                this.btn9.getComponent(ButtonBase).button.enabled = true;
            })
            .start();
    }

    activeBtn10(pos: Vec3) {
        this.btn10.active = true;
        this.btn10.position = pos;
        this.btn10.scale = new Vec3(0.1, 0.1, 0.1);
        tween(this.btn10)
            .to(0.2, { scale: Vec3.ONE })
            .call(() => {
                this.btn10.getComponent(ButtonBase).button.enabled = true;
            })
            .start();
    }
}


