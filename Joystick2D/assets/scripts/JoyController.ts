import { _decorator, Animation, Component, EventTouch, log, Node, RigidBody, RigidBody2D, sp, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { Util } from '../common/Script/Util';
const { ccclass, property } = _decorator;

@ccclass('JoyController')
export class JoyController extends Component {
    static instance: JoyController;
    @property(Node) index: Node = null;
    @property(Node) joy: Node = null;
    @property(Node) touchRegion: Node = null;
    @property(Node) player: Node = null;
    @property(Node) cammera: Node = null;
    @property(Node) origin: Node = null;
    @property(Array(Node)) listMoveRegion: Array<Node> = Array<Node>();


    // @property(Node) bot: Node = null;
    // @property(Node) top: Node = null;
    // @property(Node) left: Node = null;
    // @property(Node) right: Node = null;

    canMove: boolean = true;
    moving: boolean = false;
    speed: number = 25;
    currentAnim = ""
    initLocation: Vec3 = null;
    playerRig: RigidBody2D = null;

    protected onLoad(): void {
        this.playerRig = this.player.getComponent(RigidBody2D);
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

    }

    onTouchStart(touch: EventTouch) {
        if (!this.canMove) return;
        let touchLocation = v3(touch.getUILocation().x, touch.getUILocation().y)
        // this.joy.setWorldPosition(v3(this.origin.getWorldPosition().x, this.origin.getWorldPosition().y))
        this.joy.setWorldPosition(touchLocation);
    }

    onTouchMove(touch: EventTouch) {
        if (!this.canMove) return;
        let touchLocation = v3(touch.getLocation().x, touch.getLocation().y)
        let initPos = v3(touch.getStartLocation().x, touch.getStartLocation().y)
        let calV = v3(touchLocation.x - initPos.x, touchLocation.y - initPos.y).normalize();
        this.index.setPosition(v3(calV.x * 30, calV.y * 30));
    }
    onTouchEnd() {
        if (!this.canMove) return;
        this.index.setPosition(v3(0, 0))
        this.playerRig.linearVelocity = v2(0, 0);
        this.moving = false;
        // this.player.getChildByName("main").getComponent(Animation).play('playerIdle')
    }

    playerMove() {
        // if (!this.canMove) return;
        let calV = this.index.getPosition().normalize();
        let playerPos = this.player.getWorldPosition();

        this.playerRig.linearVelocity = v2(calV.x * this.speed, calV.y * this.speed)
        // this.player.setScale(
        //     v3(
        //         calV.x <= 0 ? 1 : -1
        //         ,
        //         1
        //     )
        // )
        // if (!this.moving) {
        //     // this.player.getChildByName("main").getComponent(Animation).play('playerRun');
        //     this.moving = true;
        // }
        // if(playerPos.x < this.left.worldPosition.x && calV.x<0) calV.x=0;
        // if(playerPos.x > this.right.worldPosition.x && calV.x>0) calV.x=0;
        // if(playerPos.y < this.bot.worldPosition.y && calV.y<0) calV.y=0
        // if(playerPos.y > this.top.worldPosition.y && calV.y>0) calV.y=0

        // let onBoard = true;
        // for (let i = 0; i < this.listMoveRegion.length; i++) {
        //     let nextPoint = v2(
        //         Util.getLocalPosition(this.player.getWorldPosition(), this.listMoveRegion[i].parent).x, 
        //         Util.getLocalPosition(this.player.getWorldPosition(), this.listMoveRegion[i].parent).y
        //     ).add(v2(calV.x*15, calV.y*15))
        //     if(this.listMoveRegion[i].getComponent(UITransform).getBoundingBox().contains(nextPoint)){
        //         onBoard = true;
        //         break;
        //     }
        // }
        // if (!onBoard) {
        //     tween(this.player).by(0.1, { worldPosition: v3(0, 0) }).call(() => {
        //     }).start();
        // } else {
        //     tween(this.player).by(0.1, { worldPosition: v3(calV.x * this.speed, calV.y * this.speed) }).call(() => {
        //     }).start();
        // }
    }


    block() {
        this.moving = false;
        this.canMove = false;
        this.joy.active = false;
    }
    unBlock() {
        this.moving = false;
        this.canMove = true;
        this.joy.active = true;
        this.onTouchEnd();
    }
}


