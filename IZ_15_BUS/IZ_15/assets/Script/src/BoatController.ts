import { _decorator, Component, easing, instantiate, log, Node, Prefab, tween, Vec3 } from 'cc';
import { Row } from '../Row';
import { GameManager } from '../GameManager';
import { AudioManager } from './AudioManager';
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
    activeRow: Row[] = [];
    isToBoat: boolean = false;

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

    toBoat() {
        if (this.activeRow.length == 0 || this.currentBoat == null || this.isToBoat) return;
        this.isToBoat = true;
        let delay = 0;
        for (let i = 0; i < this.currentBoat.children.length; i++) {
            if (this.currentBoat.children[i].children.length == 0) {
                tween(this.node)
                    .delay(delay)
                    .call(() => {
                        this.activeRow[i % this.activeRow.length].toBoat(this.currentBoat.children[i]);
                    })
                    .start();
            }
            delay += 0.25;
        }
        let delayTime = 0.25 * this.currentBoat.children.length;
        let oldBoat = this.currentBoat;
        tween(oldBoat)
            .delay(delayTime + 0.2)
            .call(() => {
                GameManager.getInstance().spawnVfxCoin();
                AudioManager.getInstance().playSoundCoin();
                this.currentBoat = null;
            })
            .delay(0.5)
            .call(() => {
                this.isToBoat = false;
                GameManager.getInstance().updateMoney(this.price);
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
        this.price = 100;
    }

    spawnBoat() {
        let boat = instantiate(this.currentBoatType);
        boat.parent = this.node;
        boat.position = new Vec3(0, 1700, 0);
        tween(boat)
            .to(1, { position: Vec3.ZERO }, { easing: easing.quadOut })
            .call(() => {
                this.currentBoat = boat;
                this.toBoat();
            })
            .start();
    }
}


