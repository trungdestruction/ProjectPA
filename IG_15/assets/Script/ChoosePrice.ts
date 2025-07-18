import { _decorator, Component, EventTouch, Node, UITransform, Vec2, Vec3, view, screen, log, Label, builtinResMgr, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChoosePrice')
export class ChoosePrice extends Component {
    @property(Node)
    targetNode: Node = null;

    @property(Label)
    text: Label = null;

    @property(Node)
    tutText: Node = null;

    @property(Node)
    tutBtn: Node = null;

    @property(Node)
    tutHand: Node = null;

    @property(Sprite)
    fill: Sprite = null;


    firstTouch: boolean = false;
    x: number = -340;
    price: number = 5;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouch, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouch, this);
    }

    onTouch(event: EventTouch) {
        if (!this.firstTouch) {
            this.firstTouch = true;
            // this.tutText.active = false;
            this.tutBtn.active = true;
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
        this.price = Math.round((this.x + 340) / 680 * 5 + 5);
        this.text.string = this.price.toString();
        this.fill.fillRange = (this.x + 340) / 680;
    }
}


