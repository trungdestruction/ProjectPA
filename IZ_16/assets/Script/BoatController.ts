import { _decorator, Component, easing, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { GameManager } from './src/GameManager';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('BoatController')
export class BoatController extends Component {
    @property(Prefab)
    boat1: Prefab = null;

    @property(Prefab)
    boat2: Prefab = null;

    price: number = 100;
    currentBoatType: Prefab = null;
    currentBoat: Node = null;

    private static _instance: BoatController = null;
    public static getInstance(): BoatController {
        return BoatController._instance;
    }

    protected onLoad(): void {
        BoatController._instance = this;
    }

    protected start(): void {
        this.currentBoatType = this.boat1;
        this.spawnBoat();
    }

    spawnBoat() {
        let boat = instantiate(this.currentBoatType);
        boat.parent = this.node;
        boat.position = new Vec3(0, 1700, 0);
        tween(boat)
            .to(1, { position: Vec3.ZERO }, { easing: easing.quadOut })
            .call(() => {
                this.currentBoat = boat;
                GameManager.getInstance().activeBtn1 = true;
                GameManager.getInstance().setSpriteBtn1();
                GameManager.getInstance().setMaxLabelBtn1(this.currentBoat.children.length);
                if(!GameManager.getInstance().firstClick){
                    GameManager.getInstance().firstClick = true;
                    GameManager.getInstance().tutHandBtn1.active = true;
                }
            })
            .start();
    }

    endPos(): Node {
        if (this.currentBoat == null) return;
        for (let i = 0; i < this.currentBoat.children.length; i++) {
            if (this.currentBoat.children[i].children.length == 0) {
                return this.currentBoat.children[i];
            }
        }
    }

    isFull() {
        let oldBoat = this.currentBoat;
        tween(oldBoat)
            .delay(0.5)
            .call(() => {
                GameManager.getInstance().spawnVfxCoin();
                AudioManager.getInstance().playSoundCoin();
                this.currentBoat = null;
            })
            .delay(0.8)
            .call(() => {
                GameManager.getInstance().updateMoney(this.price);
                this.price += 100;
                this.spawnBoat();
            })
            .to(0.5, { position: new Vec3(0, -1700, 0) }, { easing: easing.quadIn })
            .call(() => {
                oldBoat.destroy();
            })
            .start();
    }

    upgradeBoat(){
        this.currentBoatType = this.boat2;
    }
}


