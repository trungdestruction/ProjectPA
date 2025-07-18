import { _decorator, Component, Node, SpriteRenderer, Animation } from 'cc';
import { GameManager } from './GameManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    num: number = 99;
    numArr: number[] = [];
    
    @property([Node])
    displayNum: Node[] = [];

    @property(Node)
    vfxCoin: Node = null;

    updateOrder() {
        this.num -= 1;
        this.vfxCoin.active = true;
        this.vfxCoin.getComponent(Animation).play('Coin');
        AudioManager.getInstance().playSoundDone();
        this.numArr = this.num.toString().split('').map(Number);
        for (let i = 0; i < this.numArr.length; i++) {
            this.displayNum[i].getComponent(SpriteRenderer).spriteFrame = GameManager.getInstance().number[this.numArr[i]];
        }
        GameManager.getInstance().updateMoney(10);
    }
}


