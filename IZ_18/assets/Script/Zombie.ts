import { _decorator, CircleCollider2D, Collider2D, Component, ERigidBody2DType, Node, RigidBody2D, UITransform, Vec2, Vec3 } from 'cc';
import { ZombieController } from './ZombieController';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Zombie')
export class Zombie extends Component {

    rigid: RigidBody2D = null!;
    col: CircleCollider2D = null!;
    moveDir: Vec2 = new Vec2(0, 1);
    moveSpeed: number = 3;
    phase1: boolean = false;
    phase2: boolean = false;
    phase3: boolean = false;
    danger: boolean = false;

    protected start(): void {
        this.rigid = this.getComponent(RigidBody2D)!;
        this.rigid.type = ERigidBody2DType.Dynamic;
        this.rigid.fixedRotation = true;

        this.col = this.getComponent(CircleCollider2D);
        this.col.radius = 55;

        // Giảm ma sát để không dính tường
        this.rigid.linearDamping = 0;
        this.rigid.angularDamping = 0;
    }

    update(dt: number) {
        this.rigid.linearVelocity = this.moveDir.clone().multiplyScalar(this.moveSpeed);

        // if (!this.phase1) {
        //     if (this.node.position.x < 300) {
        //         this.phase1 = true;
        //         this.moveSpeed = 2;
        //     }
        // }
        // else {
        //     if (!this.phase2) {
        //         if (this.node.position.x < -140) {
        //             this.phase2 = true;
        //             this.moveDir = new Vec2(-1, -1);
        //         }
        //     }
        //     else {
        //         if (this.node.position.x < -300 && !this.phase3) {
        //             this.phase3 = true;
        //             this.node.scale = Vec3.ONE;
        //             this.moveDir = new Vec2(0, -1);
        //             this.moveSpeed = 1;
        //             this.node.parent.getComponent(ZombieController).dangerZone.push(this.node);
        //         }
        //     }
        // }
        if (this.node.position.y > -200 && !this.danger) {
            this.danger = true;
            this.node.parent.getComponent(ZombieController).dangerZone.push(this.node);
        }
    }

    protected onDestroy(): void {
        GameManager.getInstance().spawnSplash(this.node.worldPosition);
    }


}


