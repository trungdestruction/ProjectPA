import { _decorator, Animation, Component, EventTouch, log, Node, RigidBody, RigidBody2D, sp, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { Util } from '../common/Script/Util';
import { Player } from '../Script/Player';
import { GameManager } from '../Script/src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('JoyController')
export class JoyController extends Component {
    static instance: JoyController;
    @property(Node)
    index: Node = null;
    @property(Node)
    joy: Node = null;
    @property(Node)
    touchRegion: Node = null;
    @property(Node)
    player: Node = null;
    @property(Node)
    cammera: Node = null;
    @property(Node)
    tuto: Node = null;

    firstClick: boolean = false;
    canMove: boolean = true;
    moving: boolean = false;
    speed: number = 20;
    initLocation: Vec3 = null;
    playerRig: RigidBody2D = null;
    playerController: Player = null;
    countTime: number = 0;

    protected onLoad(): void {
        this.playerRig = this.player.getComponent(RigidBody2D);
        this.playerController = this.player.getComponent(Player);
    }

    start() {
        JoyController.instance = this;
        this.touchRegion.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.touchRegion.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.touchRegion.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.schedule(() => {
            if (this.index.position.x != 0 || this.index.position.y != 0) {
                this.playerMove();
            }
        }, 0.1)
    }

    update(deltaTime: number) {
        this.countTime += deltaTime;
        if (!this.firstClick) return;
        if (this.countTime >= 3.5) {
            this.tuto.active = true;
        }
        if (this.countTime >= 7) {
            GameManager.getInstance().endCard.active = true;
        }
    }

    onTouchStart(touch: EventTouch) {
        if (!this.canMove) return;
        if (!this.firstClick) {
            this.firstClick = true;
        }
        this.countTime = 0;
        this.tuto.active = false;
        this.joy.active = true;
        this.playerController.anim.play('Run');
        let touchLocation = v3(touch.getUILocation().x, touch.getUILocation().y);
        this.joy.setWorldPosition(touchLocation);
    }

    onTouchMove(touch: EventTouch) {
        if (!this.canMove) {
            this.onTouchEnd();
            return;
        }
        this.countTime = 0;
        let touchLocation = v3(touch.getLocation().x, touch.getLocation().y)
        let initPos = v3(touch.getStartLocation().x, touch.getStartLocation().y)
        let calV = v3(touchLocation.x - initPos.x, touchLocation.y - initPos.y).normalize();
        if (calV.x > 0) {
            this.player.getComponent(Player).graphicAll.scale = v3(1, 1, 1);
        }
        else {
            this.player.getComponent(Player).graphicAll.scale = v3(-1, 1, 1);
        }
        this.index.setPosition(v3(calV.x * 90, calV.y * 90));
    }

    onTouchEnd() {
        // if (!this.canMove) return;
        this.joy.active = false;
        this.playerController.anim.play('Idle');
        this.index.setPosition(v3(0, 0))
        this.playerRig.linearVelocity = v2(0, 0);
        this.moving = false;
    }

    playerMove() {
        let calV = this.index.getPosition().normalize();
        this.playerRig.linearVelocity = v2(calV.x * this.speed, calV.y * this.speed);
    }

}


