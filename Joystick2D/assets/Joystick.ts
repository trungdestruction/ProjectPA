import { _decorator, Component, Node, screen, Vec3, UITransform, EventTouch, EventTarget, Enum, Vec2, } from 'cc';
const { ccclass, property } = _decorator;

export const instance = new EventTarget();

export enum SpeedType {
    STOP,
    NORMAL,
    FAST,
}

export enum JoystickType {
    FIXED,
    FOLLOW,
}

Enum(SpeedType);
Enum(JoystickType);


@ccclass('Joystick')
export default class Joystick extends Component {
    @property({ type: Node })
    dot: Node = null!;

    @property({ type: Node })
    ring: Node = null!;

    @property({ type: JoystickType })
    joystickType: JoystickType = JoystickType.FIXED;

    private _radius: number = 0;
    private _stickPos: Vec3 = new Vec3();
    private _touchLocation: Vec3 = new Vec3();

    onLoad() {
        this._radius = this.ring.getComponent(UITransform)!.width / 2;
        this._initTouchEvents();

        if (this.joystickType === JoystickType.FOLLOW) {
            this.node.active = false;
        }
    }

    onEnable() {
        instance.on('set_joystick_type', this._onSetJoystickType, this);
    }

    onDisable() {
        instance.off('set_joystick_type', this._onSetJoystickType, this);
    }

    private _onSetJoystickType(type: JoystickType) {
        this.joystickType = type;
        this.node.active = type === JoystickType.FIXED;
    }

    private _initTouchEvents() {
        this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    private _onTouchStart(event: EventTouch) {
        const worldTouch = event.getLocation();
        // const local2D = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(worldTouch.x, worldTouch.y, 0));
        const local2D = this.node.inverseTransformPoint(new Vec3(), new Vec3(worldTouch.x, worldTouch.y, 0));
        const localTouch = new Vec3(local2D.x, local2D.y, 0);
        console.log(local2D);


        if (this.joystickType === JoystickType.FIXED) {
            this._stickPos = this.ring.getPosition();
            const distance = localTouch.subtract(this.ring.getPosition()).length();
            if (this._radius > distance) {
                this.dot.setPosition(localTouch);
            }
        } else {
            this._stickPos.set(localTouch);
            this._touchLocation.set(worldTouch.x, worldTouch.y, 0);
            this.node.active = true;

            this.ring.setPosition(this._stickPos);
            this.dot.setPosition(this._stickPos);
        }

        instance.emit(Node.EventType.TOUCH_START, event);
    }

    private _onTouchMove(event: EventTouch) {
        const worldTouch = event.getLocation();
        const currentTouch = new Vec3(worldTouch.x, worldTouch.y, 0);

        if (
            this.joystickType === JoystickType.FOLLOW &&
            this._touchLocation.equals(currentTouch)
        ) {
            return;
        }

        const local2D = this.ring.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(worldTouch.x, worldTouch.y, 0));
        const localTouch = new Vec3(local2D.x, local2D.y, 0);
        const distance = localTouch.length();

        const posX = this._stickPos.x + localTouch.x;
        const posY = this._stickPos.y + localTouch.y;

        const direction = new Vec2(
            posX - this.ring.position.x,
            posY - this.ring.position.y
        ).normalize();

        let speedType = SpeedType.NORMAL;

        if (distance < this._radius) {
            this.dot.setPosition(new Vec3(posX, posY, 0));
        } else {
            const limitedX = this._stickPos.x + direction.x * this._radius;
            const limitedY = this._stickPos.y + direction.y * this._radius;
            this.dot.setPosition(new Vec3(limitedX, limitedY, 0));
            speedType = SpeedType.FAST;
        }

        instance.emit(Node.EventType.TOUCH_MOVE, event, {
            speedType,
            moveDistance: direction,
        });
    }

    private _onTouchEnd(event: EventTouch) {
            this.dot.setPosition(this.ring.getPosition());

            if (this.joystickType === JoystickType.FOLLOW) {
                this.node.active = false;
            }

            instance.emit(Node.EventType.TOUCH_END, event, {
                speedType: SpeedType.STOP,
            });
    }
}
