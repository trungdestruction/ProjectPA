import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, ERigidBody2DType, IPhysics2DContact, Node, RigidBody2D, Vec2, Vec3, Animation } from 'cc';
import { GameManager } from './src/GameManager';
import { EnemyController } from './EnemyController';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    rigid: RigidBody2D = null!;
    col: CircleCollider2D = null!;
    moveDir: Vec2 = new Vec2(0, 0);
    moveSpeed: number = 8;
    hitWall: boolean = false;
    hitDanCoi: boolean = false;

    protected onLoad(): void {
        this.rigid = this.getComponent(RigidBody2D);
        this.col = this.getComponent(CircleCollider2D);
    }

    protected start(): void {
        this.rigid.type = ERigidBody2DType.Dynamic;
        this.rigid.fixedRotation = true;

        // Giảm ma sát để không dính tường
        this.rigid.linearDamping = 0;
        this.rigid.angularDamping = 0;

        if (this.node.position.x > 0) {
            this.node.scale = new Vec3(-1, 1, 1);
        }
        else {
            this.node.scale = Vec3.ONE;
        }

        let dir = this.getDirection(this.node.position, new Vec3(0, 150, 0));
        this.moveDir = new Vec2(dir.x, dir.y);

        this.col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    update(dt: number) {
        if (this.hitWall) return;
        this.rigid.linearVelocity = this.moveDir.clone().multiplyScalar(this.moveSpeed);
    }

    getDirection(from: Vec3, to: Vec3) {
        const dir = new Vec3();
        Vec3.subtract(dir, to, from);
        Vec3.normalize(dir, dir);
        return dir;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name == 'MapCol') {
            this.hitWall = true;
            EnemyController.getInstance().wall.play('Wall');
            this.rigid.linearVelocity = new Vec2(0, 0);
            this.node.getComponentInChildren(Animation).play('Atk130');
            this.scheduleOnce(() => {
                this.rigid.type = ERigidBody2DType.Kinematic;
            }, 0);
            EnemyController.getInstance().dangerZone.push(this.node);
        }

        if (otherCollider.node.name == 'DanCoi'){
            this.hitDanCoi = true;
        }
    }

    die() {
        GameManager.getInstance().spawnCoin(this.node.worldPosition);
        GameManager.getInstance().spawnVfxSplash(this.node.worldPosition);
        this.node.destroy();
    }
}


