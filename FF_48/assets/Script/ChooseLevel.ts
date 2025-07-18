import { _decorator, Component, EventTouch, Node, screen, Vec3 } from 'cc';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ChooseLevel')
export class ChooseLevel extends Component {
    @property(Node)
    targetNode: Node = null;

    @property(Node)
    tutHand: Node = null;

    @property(Node)
    btn: Node = null;

    @property(Node)
    lvl1: Node = null;

    @property(Node)
    lvl2: Node = null;

    @property(Node)
    lvl3: Node = null;

    firstTouch: boolean = false;
    x: number = -340;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouch, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouch(event: EventTouch) {
        AudioManager.getInstance().playSoundClick();
        if (!this.firstTouch) {
            this.firstTouch = true;
            this.btn.active = true;
            this.tutHand.active = false;
        }
        let location = event.getLocation();
        let offset = location.x - screen.windowSize.width / 2;
        this.x = offset / screen.windowSize.width * 1242;
        if (this.x <= -340) {
            this.x = -340;
        }
        if (this.x >= 340) {
            this.x = 340;
        }
        this.targetNode.position = new Vec3(this.x, 0, 0);
    }

    onTouchMove(event: EventTouch) {
        if (!this.firstTouch) {
            this.firstTouch = true;
            this.btn.active = true;
            this.tutHand.active = false;
        }
        let location = event.getLocation();
        let offset = location.x - screen.windowSize.width / 2;
        this.x = offset / screen.windowSize.width * 1242;
        if (this.x <= -340) {
            this.x = -340;
        }
        if (this.x >= 340) {
            this.x = 340;
        }
        this.targetNode.position = new Vec3(this.x, 0, 0);
    }

    protected update(dt: number): void {
        if (this.x < -115) {
            this.lvl1.active = true;
            this.lvl2.active = false;
            this.lvl3.active = false;
        }
        else if (this.x > 115) {
            this.lvl1.active = false;
            this.lvl2.active = false;
            this.lvl3.active = true;
        }
        else {
            this.lvl1.active = false;
            this.lvl2.active = true;
            this.lvl3.active = false;
        }
    }
}


