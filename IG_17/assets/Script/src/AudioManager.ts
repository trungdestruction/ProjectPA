import { AudioClip, AudioSource, assert, warn, clamp01, resources, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass('AudioManager')
export class AudioManager extends Component {

    @property(AudioSource)
    private soundBg: AudioSource = null;
    @property(AudioSource)
    private coin: AudioSource = null;
    @property(AudioSource)
    private upgrade: AudioSource = null;
    @property(AudioSource)
    private pop: AudioSource = null;

    setMusicVolume(flag: number) {
        flag = clamp01(flag);
        this.soundBg.volume = flag;
    }

    private static _instance: AudioManager = null;
    public static getInstance(): AudioManager {
        return AudioManager._instance;
    }

    protected onLoad(): void {
        AudioManager._instance = this;
    }

    playSoundCoin() {
        this.coin.currentTime = 0;
        this.coin.play();
    }

    playSoundUpgade() {
        this.upgrade.currentTime = 0;
        this.upgrade.play();
    }

    playSoundPop() {
        this.pop.currentTime = 0;
        this.pop.play();
    }
}