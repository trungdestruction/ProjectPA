import { _decorator, Component, Node, Animation, Vec3, tween, Sprite, SpriteFrame } from 'cc';
import { SoliderRocket } from './SoliderRocket';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('WorkerDanCoi')
export class WorkerDanCoi extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Animation)
    vfxUpgrade: Animation = null;

    @property(Node)
    carry: Node = null;

    @property(SpriteFrame)
    stay2: SpriteFrame = null;

    @property(Node)
    startPos: Node = null;

    @property(Node)
    endPos: Node = null;

    @property(Node)
    solider: Node = null;

    anim: Animation = null;
    distance: number = 0;

    protected onLoad(): void {
        this.anim = this.graphic.getComponent(Animation);
        this.distance = Vec3.distance(this.startPos.position, this.endPos.position);
    }

    protected start(): void {
        if(this.solider.active){
            this.carrying();
        }
    }

    carrying() {
        this.anim.play('Carry30R');
        this.carry.active = true;
        this.carry.children[0].position = new Vec3(-4, -7, 0);
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speed, { position: this.endPos.position })
            .call(() => {
                this.serve();
            })
            .start();
    }

    serve() {
        this.anim.stop();
        this.graphic.getComponent(Sprite).spriteFrame = this.stay2;
        this.JumpTo(this.carry.children[0], this.carry.children[0].position, new Vec3(70, 65, 0), 100, 0.3);
        tween(this.node)
            .delay(0.15)
            .call(() => {
                this.solider.getComponent(SoliderRocket).updateBullet(1);
                this.carry.active = false; 
                this.move();
            })
            .start();
    }

    move() {
        this.anim.play('Run130');
        tween(this.node)
            .to(this.distance / GameManager.getInstance().speed, { position: this.startPos.position })
            .call(() => {
                this.carrying();
            })
            .start();
    }

    JumpTo(node: Node, startPos: Vec3, endPos: Vec3, jumpHeight: number, duration: number) {
        const tempObj = { t: 0 };

        tween(tempObj)
            .to(duration, { t: 1 }, {
                onUpdate: () => {
                    const t = tempObj.t;

                    // X, Z di chuyển tuyến tính
                    const x = startPos.x + (endPos.x - startPos.x) * t;
                    const z = startPos.z + (endPos.z - startPos.z) * t;

                    // Y theo parabol: y = lerp + jumpHeight * 4t(1 - t)
                    const linearY = startPos.y + (endPos.y - startPos.y) * t;
                    const y = linearY + jumpHeight * 4 * t * (1 - t);

                    node.setPosition(new Vec3(x, y, z));
                }
            })
            .start();
    }
}


