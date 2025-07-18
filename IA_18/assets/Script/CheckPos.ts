import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CheckPos')
export class CheckPos extends Component {
    isUsing: boolean = false;
    isEquip: boolean = false;
    isWaitting: boolean = false;
}


