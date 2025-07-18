import { _decorator, Component, Node } from 'cc';
import { Worker } from './Constant/Worker';

const { ccclass, property } = _decorator;

@ccclass('WorkerController')
export class WorkerController extends Component {
    // @property(Node)
    // machinePos: Node[] = [];

    @property(Node)
    servePos: Node = null;

    // @property(Node)
    // workerArr: Node[] = [];

    timeProgress: number = 2;

    private static _instance: WorkerController = null;
    public static getInstance(): WorkerController {
        return WorkerController._instance;
    }

    protected onLoad(): void {
        WorkerController._instance = this;
    }

    protected start(): void {
        this.scheduleOnce(()=>{
            // this.queue();
        }, 1)
    }

    // queue() {
    //     for (let i = 0; i < this.workerArr.length; i++) {
    //         if (this.workerArr[i].active) {
    //             for (let j = 0; j < this.machinePos.length; j++) {
    //                 if (this.machinePos[j].children.length == 0) {
    //                     if (j == 0) {
    //                         this.workerArr[i].getComponent(Worker).run(this.machinePos[j], false);
    //                     }
    //                     else {
    //                         this.workerArr[i].getComponent(Worker).run(this.machinePos[j], true);
    //                     }
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }
}


