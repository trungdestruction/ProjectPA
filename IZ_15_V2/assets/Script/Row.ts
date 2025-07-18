import { _decorator, Component, instantiate, Node, Prefab, sp, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { BoatController } from './src/BoatController';
import { GameManager } from './GameManager';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Row')
export class Row extends Component {

    @property(Sprite)
    bridge: Sprite = null;

    @property(SpriteFrame)
    unlockBridge: SpriteFrame = null;

    @property(Node)
    btnLvlUp: Node = null;

    @property(Node)
    btnPrice: Node = null;

    @property(SpriteFrame)
    inActive: SpriteFrame = null;
    
    @property(SpriteFrame)
    activeSprte: SpriteFrame = null;

    @property(Node)
    p1: Node = null;

    @property(Node)
    smoke: Node = null;

    @property([Prefab])
    character: Prefab[] = [];

    @property(Number)
    price: number = 25;

    priceSprite: Sprite = null;
    unlockedLine: boolean = false;

    protected start(): void {
        this.priceSprite = this.btnPrice.getComponent(Sprite);
        this.spawnChar(new Vec3(0, 0, 0));
        this.spawnChar(new Vec3(100, 0, 0));
        this.spawnChar(new Vec3(200, 0, 0));
        this.spawnChar(new Vec3(300, 0, 0));
    }

    unlockLine() {
        if(GameManager.getInstance().money < this.price) return;
        GameManager.getInstance().toStore();
        AudioManager.getInstance().playSoundUpgade();

        this.smoke.active = true;
        this.bridge.spriteFrame = this.unlockBridge;
        this.btnLvlUp.active = false;
        this.btnPrice.active = false;
        this.unlockedLine = true;
        GameManager.getInstance().updateMoney(-this.price);
        BoatController.getInstance().activeRow.push(this);
        BoatController.getInstance().toBoat();
    }

    activeLine(currentMoney: number) {
        if (this.unlockedLine) return;
        if (currentMoney < this.price) {
            this.priceSprite.spriteFrame = this.inActive;
            this.btnLvlUp.active = false;
        }
        else {
            this.priceSprite.spriteFrame = this.activeSprte;
            this.btnLvlUp.active = true;
        }
    }

    toBoat(parent: Node) {
        let firstChild = this.node.children[0];
        let oldPos = firstChild.worldPosition;
        firstChild.parent = parent;
        firstChild.worldPosition = oldPos;

        let distance1 = Vec3.distance(firstChild.worldPosition, this.p1.worldPosition);

        let p2 = new Vec3(this.p1.worldPosition.x, parent.worldPosition.y, 0);
        let distance2 = Vec3.distance(this.p1.worldPosition, p2);
        let distance3 = Vec3.distance(p2, parent.worldPosition);
        tween(firstChild)
            .to(distance1 / 1200, { worldPosition: this.p1.worldPosition })
            .to(distance2 / 1200, { worldPosition: p2 })
            .to(distance3 / 1200, { worldPosition: parent.worldPosition })
            .start();

        for (let i = 0; i < this.node.children.length; i++) {
            tween(this.node.children[i])
                .to(0.2, { position: new Vec3(this.node.children[i].position.x - 100, 0, 0) })
                .start();
        }
        this.spawnChar(new Vec3(300, 0, 0));
    }

    spawnChar(pos: Vec3) {
        let ran = Math.floor(Math.random() * 5);
        let char = instantiate(this.character[ran]);
        char.parent = this.node;
        char.position = pos;
    }
}


