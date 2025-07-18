import { AudioClip, AudioSource, assert, warn, clamp01, resources, Component, _decorator } from "cc";
import super_html_playable from "./src/super_html/super_html_playable";
const { ccclass, property } = _decorator;
@ccclass('AudioManager')
export class AudioManager extends Component {

    @property(AudioSource)
    private soundBg: AudioSource = null;
    @property(AudioSource)
    private pop: AudioSource = null;
    @property(AudioSource)
    private click: AudioSource = null;
    @property(AudioSource)
    private done: AudioSource = null;
    @property(AudioSource)
    private upgrade: AudioSource = null;
    

    setMusicVolume(flag: number) {
        flag = clamp01(flag);
        this.soundBg.volume = flag;
        this.pop.volume = flag;

    }

    private static _instance: AudioManager = null;
    public static getInstance(): AudioManager {
        return AudioManager._instance;
    }

    protected onLoad(): void {
        AudioManager._instance = this;
    }

    playSoundPop() {
        this.pop.currentTime = 0;
        this.pop.play();
    }

    playSoundClick() {
        this.click.currentTime = 0;
        this.click.play();
    }

    playSoundDone() {
        this.done.currentTime = 0;
        this.done.play();
    }

    playSoundUpgade() {
        this.upgrade.currentTime = 0;
        this.upgrade.play();
    }

}