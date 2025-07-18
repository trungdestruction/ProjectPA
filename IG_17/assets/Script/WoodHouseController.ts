import { _decorator, Component, easing, instantiate, Node, Prefab, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WoodHouseController')
export class WoodHouseController extends Component {
    @property(Node)
    woodStore: Node = null;

    @property(Node)
    swordStore: Node = null;

    @property(Prefab)
    sword: Prefab = null;

    private static _instance: WoodHouseController = null;
    public static getInstance(): WoodHouseController {
        return WoodHouseController._instance;
    }

    protected onLoad(): void {
        WoodHouseController._instance = this;
    }

    spawnSword() {

        let delay = 0;
        for (let i = 0; i < 10; i++) {
            if (this.woodStore.children.length == 0) return;
            let wood = this.woodStore.children[this.woodStore.children.length - 1 - i];
            if (this.swordStore.children.length >= 10) {
                tween(wood)
                    .delay(delay)
                    .to(0.2, { scale: Vec3.ZERO })
                    .call(() => {
                        wood.destroy();
                    })
                    .start();
            }
            else {
                let sword = instantiate(this.sword);
                sword.parent = this.swordStore;
                sword.position = v3(0, 10 * i, 0);
                sword.scale = v3(0.1, 0.1, 0.1);
                tween(wood)
                    .delay(delay)
                    .to(0.2, { scale: Vec3.ZERO })
                    .call(() => {
                        wood.destroy();
                        tween(sword)
                            .to(0.1, { scale: Vec3.ONE }, { easing: easing.backOut })
                            .start();
                    })
                    .start();
            }

            delay += 0.05;
        }
    }

    autoSpawnSword() {
        this.schedule(() => {
            if (this.swordStore.children.length == 0) {
                let delay = 0;
                for (let i = 0; i < 10; i++) {
                    tween(this.node)
                        .delay(delay)
                        .call(() => {
                            let sword = instantiate(this.sword);
                            sword.parent = this.swordStore;
                            sword.position = v3(0, 10 * i, 0);
                            sword.scale = v3(0.1, 0.1, 0.1);
                            tween(sword)
                                .to(0.1, { scale: Vec3.ONE }, { easing: easing.backOut })
                                .start();
                        })
                        .start();
                    delay += 0.05;
                }
            }
        }, 1)

        // this.schedule(() => {
        //     if (this.swordStore.children.length < 10) {
        //         let sword = instantiate(this.sword);
        //         sword.parent = this.swordStore;
        //         sword.position = v3(0, 10 * this.swordStore.children.length, 0);
        //         sword.scale = v3(0.1, 0.1, 0.1);
        //         tween(sword)
        //             .to(0.1, { scale: Vec3.ONE }, { easing: easing.backOut })
        //             .start();
        //     }
        // }, 0.05);
    }
}


