import { _decorator, Component, easing, instantiate, Node, Prefab, sp, tween, Vec2, Vec3, Animation } from 'cc';
import { GameManager } from './src/GameManager';
import { Customer } from './Customer';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('CustomerController')
export class CustomerController extends Component {
    @property(Node)
    cooker: Node = null;

    @property([Prefab])
    customer: Prefab[] = [];

    @property(Boolean)
    sound: boolean = false;

    cookerAnim: Animation = null;
    currentCus: Node = null;
    row: Node[] = [];

    protected onLoad(): void {
        this.cookerAnim = this.cooker.getComponent(Animation);
    }

    protected start(): void {
        for (let i = 0; i < 15; i++) {
            this.spawn(new Vec3(-150 * i, 0, 0));
        }
        // this.spawn(new Vec3(0, 0, 0));
        // this.spawn(new Vec3(-150, 0, 0));
        // this.spawn(new Vec3(-300, 0, 0));
        // this.spawn(new Vec3(-450, 0, 0));
        // this.spawn(new Vec3(-600, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));
        // this.spawn(new Vec3(-750, 0, 0));

        this.row[0].getComponent(Customer).closeChatBox();
        this.cook();
    }

    cook() {
        let duration = 1.5 / GameManager.getInstance().speed;
        let stateCook = this.cookerAnim.getState('Cook');
        stateCook.speed = GameManager.getInstance().speed;
        this.cookerAnim.play('Cook');
        tween(this.node)
            .delay(duration)
            .call(() => {
                this.move();
                this.cook();
            })
            .start();
    }

    spawn(pos: Vec3) {
        let cus = instantiate(this.customer[Math.floor(Math.random() * this.customer.length)]);
        cus.parent = this.node;
        cus.position = pos;
        this.row.push(cus);
    }

    move() {
        let cusOut = this.row[0];
        this.row.shift();
        cusOut.getComponent(Customer).out();
        if (this.sound) {
            AudioManager.getInstance().playSoundCoin();
        }
        this.row[0].getComponent(Customer).closeChatBox();
        this.row.forEach(cus => {
            cus.getComponent(Customer).move();
        });
        this.spawn(new Vec3(-150 * 14, 0, 0));
    }


}


