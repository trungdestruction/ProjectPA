import { _decorator, Component, instantiate, Node, Prefab, sp, tween, Vec3 } from 'cc';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('RowController')
export class RowController extends Component {
    @property(Node)
    spawnPos: Node = null;

    @property(Prefab)
    character: Prefab[] = [];

    speed: number = 1000;


    protected start(): void {
        this.spawnChar(new Vec3(0, 0, 0));
        this.spawnChar(new Vec3(-100, 0, 0));
        this.spawnChar(new Vec3(-200, 0, 0));
        this.spawnChar(new Vec3(-300, 0, 0));
    }

    toBoat(parent: Node) {
        let char = this.spawnPos.children[0];
        let oldPos = char.worldPosition;
        char.parent = parent;
        char.worldPosition = oldPos;

        let p1 = parent.inverseTransformPoint(new Vec3(), GameManager.getInstance().p1.worldPosition);
        let p2 = parent.inverseTransformPoint(new Vec3(), GameManager.getInstance().p2.worldPosition);
        let p3 = new Vec3(p2.x, 0, 0);
        let speed = 1000;
        let d1 = Vec3.distance(char.position, p1) / speed;
        let d2 = Vec3.distance(p1, p2) / speed;
        let d3 = Vec3.distance(p2, p3) / speed;
        let d4 = Vec3.distance(p3, Vec3.ZERO) / speed;

        tween(char)
            .to(d1, { position: p1 })
            .to(d2, { position: p2 })
            .to(d3, { position: p3 })
            .to(d4, { position: Vec3.ZERO })
            .start();

        for (let i = 0; i < this.spawnPos.children.length; i++) {
            tween(this.spawnPos.children[i])
                .to(0.1, { position: new Vec3(this.spawnPos.children[i].position.x + 100, 0, 0) })
                .start();
        }

        this.spawnChar(new Vec3(-300, 0, 0));
    }

    spawnChar(pos: Vec3) {
        let ran = Math.floor(Math.random() * this.character.length);
        let char = instantiate(this.character[ran]);
        char.parent = this.spawnPos;
        char.position = pos;
    }
}


