import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { Solider } from './Constant/Solider';
import { GameManager } from './src/GameManager';
const { ccclass, property } = _decorator;

@ccclass('SoliderController')
export class SoliderController extends Component {
    @property(Prefab)
    solider: Prefab = null;

    protected start(): void {
        let gameManager = GameManager.getInstance();

        for (let i = 19; i >= 0; i--) {
            let soliderSpawn = instantiate(this.solider);
            soliderSpawn.parent = this.node;
            soliderSpawn.position = new Vec3(-500, 1500 + 150 * i, 0);

            let soliderComp = soliderSpawn.getComponent(Solider);
            soliderComp.moveToEndPos(this.queue(i));

            if (i <= 2) {
                switch (i) {
                    case 2:
                        gameManager.cus3 = soliderSpawn;
                        break;
                    case 1:
                        gameManager.cus2 = soliderSpawn;
                        break;
                    case 0:
                        gameManager.cus1 = soliderSpawn;
                        break;
                }
            }

            if (i > 3) {
                soliderComp.changeEmoji();
            }
        }
    }

    queue(slot: number) {
        let queueX = -300;
        let queueY = 400;
        let row = Math.floor(slot / 4);
        let col = slot % 4;
        return new Vec3(queueX + 200 * (col), queueY + 200 * (row), 0);
    }
}


