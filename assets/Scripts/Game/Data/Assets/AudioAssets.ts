import { AudioClip, Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass("AudioAssets")
export class AudioAssets extends Component {
    @property(AudioClip) public buttonClick: AudioClip;
}
