import { _decorator, Component, Node } from 'cc';
import { AudioManager } from './src/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('PlaySoundWoosh')
export class PlaySoundWoosh extends Component {
    playSoundWoosh(){
        AudioManager.getInstance().playSoundWoosh();
    }
}


