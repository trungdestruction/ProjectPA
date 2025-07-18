import { _decorator, Component, instantiate, Node, Prefab, Vec2, Vec3 } from 'cc';
import { CheckPos } from './CheckPos';
import { WorkerController } from './WorkerController';
import { Solider } from './Solider';
const { ccclass, property } = _decorator;

@ccclass('SoliderController')
export class SoliderController extends Component {
    @property([Node])
    checkPos: Node[] = [];

    @property([Node])
    waittingPos: Node[] = [];

    @property([Node])
    battlePos: Node[] = [];

    @property(Prefab)
    soliderPrefab: Prefab = null;

    soliderArr: Node[] = [];

    private static _instance: SoliderController = null;
    public static getInstance(): SoliderController {
        return SoliderController._instance;
    }

    protected onLoad(): void {
        SoliderController._instance = this;
    }

    protected start(): void {
        this.spawn();
        this.spawn();
        this.spawn();
        this.spawn();
        this.schedule(() => {
            this.spawn();
        }, 1)
    }

    spawn() {
        // for (let i = 0; i < this.checkPos.length; i++) {
        //     let pos = this.checkPos[i].getComponent(CheckPos);
        //     if (!pos.isUsing) {
        //         pos.isUsing = true;
        //         let solider = instantiate(this.soliderPrefab);
        //         this.soliderArr.push(solider);
        //         solider.parent = this.node;
        //         let soliderComponent = solider.getComponent(Solider);
        //         soliderComponent.id = pos.id;
        //         soliderComponent.soliderController = this.getComponent(SoliderController);
        //         solider.position = new Vec3(-700, -235, 0);
        //         soliderComponent.move(pos.node.position);
        //         break;
        //     }
        // }
        for (let i = 0; i < this.waittingPos.length; i++) {
            let waitting = this.waittingPos[i];
            if (waitting.children.length == 0) {
                let solider = instantiate(this.soliderPrefab);
                solider.parent = waitting;
                solider.position = new Vec3(-1100, 0, 0);
                solider.getComponent(Solider).move();
                return;
            }
        }
    }

    queue() {
        for (let i = 0; i < this.checkPos.length; i++) {
            let pos = this.checkPos[i];
            if (pos.children.length == 0 && this.waittingPos[i].children.length > 0) {
                this.waittingPos[i].getComponent(CheckPos).isWaitting = false;
                let solider = this.waittingPos[i].children[0];
                let oldPos = solider.worldPosition;
                solider.parent = pos;
                solider.worldPosition = oldPos;
                solider.getComponent(Solider).move();
            }

        }
    }

    getSolider(): Node {
        for (let i = 0; i < this.checkPos.length; i++) {
            if (this.checkPos[i].children.length > 0 && this.waittingPos[i].getComponent(CheckPos).isWaitting && !this.checkPos[i].children[0].getComponent(Solider).isServing) {
                return this.checkPos[i].children[0];
            }
        }
    }

    getIdSolider(): number {
        for (let i = 0; i < this.checkPos.length; i++) {
            if (this.checkPos[i].getComponent(CheckPos).isUsing && !this.checkPos[i].getComponent(CheckPos).isEquip) {
                return i;
            }
        }
    }

    checkEmpty(): number {
        let ran = Math.floor(Math.random() * 12);
        if (this.battlePos[ran].children.length > 0) {
            return this.checkEmpty();
        }
        else {
            return ran;
        }
    }
}
