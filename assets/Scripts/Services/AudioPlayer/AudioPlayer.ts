import { AudioClip, AudioSource, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioPlayer")
export class AudioPlayer extends Component {
    @property(AudioSource) private soundSource: AudioSource;
    @property(AudioSource) private musicSource: AudioSource;

    public init(soundVolume: number, musicVolume: number): void {
        this.setSoundVolume(soundVolume);
        this.setMusicVolume(musicVolume);
    }

    public get SoundVolume(): number {
        return this.soundSource.volume;
    }

    public get MusicVolume(): number {
        return this.musicSource.volume;
    }

    public setSoundVolume(volume: number): void {
        this.soundSource.volume = volume;
    }

    public setMusicVolume(volume: number): void {
        this.musicSource.volume = volume;
    }

    public playSound(clip: AudioClip): void {
        this.soundSource.playOneShot(clip);
    }

    public playMusic(clip: AudioClip): void {
        this.musicSource.stop();
        this.musicSource.clip = clip;
        this.musicSource.play();
    }
}
