import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { Worker } from './Worker';
import { CheckPos } from './CheckPos';
import { SoliderController } from './SoliderController';
const { ccclass, property } = _decorator;

@ccclass('WorkerController')
export class WorkerController extends Component {
    @property([Node])
    checkPosQueue: Node[] = [];

    @property(Node)
    serve: Node = null;

    @property(Prefab)
    workerPrefab: Prefab = null;
    
    @property([Node])
    workerArr: Node[] = [];

    timeProgress = 2;
    crafting: boolean = false;


    private static _instance: WorkerController = null;
    public static getInstance(): WorkerController {
        return WorkerController._instance;
    }

    protected onLoad(): void {
        WorkerController._instance = this;
    }

    protected start(): void {
        
    }

    spawnWorker() {
        let worker = instantiate(this.workerPrefab);
        worker.parent = this.node;
        worker.position = new Vec3(100, -320, 0);
        this.workerArr.push(worker);
        console.log(worker.getComponent(Worker));

        this.workerRun();
    }

    checkQueue(): number {
        for (let i = 0; i < this.checkPosQueue.length; i++) {
            if (!this.checkPosQueue[i].getComponent(CheckPos).isUsing) {
                return i;
            }
        }
    }

    workerRun() {
        this.workerArr.forEach(worker => {
            if (worker.active) {
                worker.getComponent(Worker).run();
            }
        });
    }
}


