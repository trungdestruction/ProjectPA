import { _decorator, Component, Node, Animation, tween, Sprite, Label } from 'cc';
import { SoliderController } from './SoliderController';
import { Solider } from './Constant/Solider';
const { ccclass, property } = _decorator;

@ccclass('BossController')
export class BossController extends Component {
    @property(Node)
    graphic: Node = null;

    @property(Node)
    wall: Node = null;

    @property(Sprite)
    hpBar: Sprite = null;

    @property(Label)
    hpText: Label = null;

    totalHp: number = 10000;
    currentHp: number = 0;
    hp: number = 0;

    anim: Animation = null;

    private static _instance: BossController = null;
    public static getInstance(): BossController {
        return BossController._instance;
    }

    protected onLoad(): void {
        BossController._instance = this;
    }

    protected start(): void {
        this.anim = this.graphic.getComponent(Animation);
        this.schedule(() => {
            this.wallTakeDame();
            this.attack();
        }, 1.19)
        tween(this.node)
            .delay(0.9)
            .call(() => {
                this.anim.play('Atk');
            })
            .start();
        this.currentHp = this.totalHp;
        this.hp = this.totalHp;
    }

    protected update(dt: number): void {
        if(this.currentHp <= 0){
            this.currentHp = this.totalHp;
            this.hp = this.totalHp;
            this.hpBar.fillRange = 1;
            this.hpText.string = this.hp.toString() + '/' + this.totalHp.toString();
        }
        if (this.hp > this.currentHp) {
            this.hp -= 10;
            this.hpBar.fillRange -= 10 / this.totalHp;
            this.hpText.string = this.hp.toString() + '/' + this.totalHp.toString();
        }
    }

    scheduleAtk() {
        this.schedule(() => {
            this.attack();
        }, 1.19)
    }

    takeDame(dame: number) {
        this.currentHp -= dame;
    }

    attack() {
        let count = 0;
        SoliderController.getInstance().battleZone.children.forEach(child => {
            if (child.children.length > 0) {
                count += 1;
            }
        });
        if (count > 0) {
            this.checkSolider().getComponent(Solider).die();
        }
    }

    wallTakeDame() {
        this.wall.getComponent(Animation).play('WallTakeDame');
        // AudioManager.getInstance().playSoundCrash();
    }

    checkSolider(): Node {
        let ran = Math.floor(Math.random() * 20);
        if (SoliderController.getInstance().battleZone.children[ran].children.length > 0) {
            return SoliderController.getInstance().battleZone.children[ran].children[0];
        }
        else {
            return this.checkSolider();
        }
    }


}


