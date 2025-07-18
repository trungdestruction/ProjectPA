import { _decorator, Component, easing, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { LineController } from './LineController';
const { ccclass, property } = _decorator;

@ccclass('BoatController')
export class BoatController extends Component {
    @property(Prefab)
    boat: Prefab = null;

    @property(Node)
    line: Node[] = [];

    @property(Node)
    btnBoat: Node = null;

    currentBoat: Node = null;
    countSwitch: number = 0;
    countSlot: number = -1;
    isActive: boolean = false;

    spawnBoat() {
        let boatSpawn = instantiate(this.boat);
        this.currentBoat = boatSpawn;
        boatSpawn.parent = this.node;
        boatSpawn.position = new Vec3(0, -1200, 0);
        tween(boatSpawn)
            .to(1, { position: Vec3.ZERO }, { easing: easing.quadOut })
            .call(() => {
                this.isActive = true;
                if(this.line[0].getComponent(LineController).isActiveBridge){
                    this.line[0].getComponent(LineController).goToBoat();
                }
            })
            .delay(0.1)
            .call(() => {
                if (this.line[1].getComponent(LineController).isActiveBridge) {
                    this.line[1].getComponent(LineController).goToBoat();
                }
            })
            .start();
    }

    getSlot(): Node {
        this.countSlot += 1;
        if (this.countSlot < 2) {
            return this.currentBoat.children[this.countSlot];
        }
        else {
            this.isActive = false;
            this.countSlot = -1;
            this.boatFull();
            return this.currentBoat.children[2];
        }
    }

    boatFull() {
        let boat = this.currentBoat;
        tween(boat)
            .delay(1.2)
            .to(1, { position: new Vec3(0, -1200, 0) }, { easing: easing.quadIn })
            .call(() => {
                this.spawnBoat();
                boat.destroy();
            })
            .start();
    }

    unlockBoat(){
        this.spawnBoat();
        this.btnBoat.active = false;
    }
}


