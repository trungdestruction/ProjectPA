import { _decorator, Component, Node, Vec2, Vec3, RigidBody2D, PhysicsSystem2D, math, EventTouch } from 'cc';
import { instance, SpeedType } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Boolean)
    rigidbody: boolean = false;

    @property(Vec2)
    moveDir: Vec2 = new Vec2(0, 1);

    @property({ type: SpeedType })
    _speedType: SpeedType = SpeedType.STOP;

    @property(Number)
    _moveSpeed: number = 0;

    @property(Number)
    stopSpeed: number = 0;

    @property(Number)
    normalSpeed: number = 100;

    @property(Number)
    fastSpeed: number = 200;

    private _body: RigidBody2D | null = null;

    onLoad() {
        if (this.rigidbody) {
            PhysicsSystem2D.instance.enable = true;
            this._body = this.getComponent(RigidBody2D);
        }

        instance.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        instance.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart() { }

    onTouchMove(event: EventTouch, data: any) {
        this._speedType = data.speedType;
        this.moveDir = data.moveDistance;
    }

    onTouchEnd(event: EventTouch, data: any) {
        this._speedType = data.speedType;
    }

    move() {
        // quay hướng
        this.node.angle = math.toDegree(Math.atan2(this.moveDir.y, this.moveDir.x)) - 90;

        if (this.rigidbody && this._body) {
            this._body.applyForceToCenter(new Vec2(this.moveDir.x * 200, this.moveDir.y * 200), true);
        } else {
            const currentPos = this.node.getPosition();
            const moveVec3 = new Vec3(this.moveDir.x, this.moveDir.y, 0).multiplyScalar(this._moveSpeed / 120);
            const newPos = currentPos.add(moveVec3);
            this.node.setPosition(newPos);
        }
    }

    update(dt: number) {
        switch (this._speedType) {
            case SpeedType.STOP:
                this._moveSpeed = this.stopSpeed;
                break;
            case SpeedType.NORMAL:
                this._moveSpeed = this.normalSpeed;
                break;
            case SpeedType.FAST:
                this._moveSpeed = this.fastSpeed;
                break;
        }

        if (this._speedType !== SpeedType.STOP) {
            this.move();
        }
    }
}
