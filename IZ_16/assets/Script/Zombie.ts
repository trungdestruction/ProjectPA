import { _decorator, CircleCollider2D, Component, ERigidBody2DType, instantiate, Node, RigidBody, RigidBody2D, sp, tween, Vec2 } from 'cc';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Zombie')
export class Zombie extends Component {
    rigid: RigidBody2D = null;
    moveDir: Vec2 = new Vec2(0, 1);
    moveSpeed: number = 3;

    onLoad() {
        let circleCollider = this.addComponent(CircleCollider2D);
        circleCollider.radius = 45;
        this.rigid = this.addComponent(RigidBody2D);
        this.rigid.gravityScale = 0;
        this.rigid.fixedRotation = true;
    }

    protected update(dt: number): void {
        this.rigid.linearVelocity = this.moveDir.clone().multiplyScalar(this.moveSpeed);
    }

    protected onDestroy(): void {
        let splash = instantiate(GameManager.getInstance().splashVfx);
        splash.parent = GameManager.getInstance().node;
        splash.worldPosition = this.node.worldPosition;
    }

}