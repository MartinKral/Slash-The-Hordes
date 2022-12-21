import { Component, director, JsonAsset, _decorator } from "cc";
import { GameSettings } from "../Game/Data/GameSettings";
import { TranslationData } from "../Game/Data/TranslationData";
import { UserData } from "../Game/Data/UserData";
import { AudioPlayer } from "../Services/AudioPlayer/AudioPlayer";
import { SaveSystem } from "./SaveSystem";
const { ccclass, property } = _decorator;

@ccclass("AppRoot")
export class AppRoot extends Component {
    @property(AudioPlayer) private audio: AudioPlayer;
    @property(JsonAsset) private settingsAsset: JsonAsset;
    @property(JsonAsset) private engTranslationAsset: JsonAsset;

    private static instance: AppRoot;
    private saveSystem: SaveSystem;

    private liveUserData: UserData;

    public static get Instance(): AppRoot {
        return this.instance;
    }

    public get AudioPlayer(): AudioPlayer {
        return this.audio;
    }

    public get LiveUserData(): UserData {
        return this.liveUserData;
    }

    public get Settings(): GameSettings {
        return <GameSettings>this.settingsAsset.json;
    }

    public get TranslationData(): TranslationData {
        return <TranslationData>this.engTranslationAsset.json;
    }

    public saveUserData(): void {
        this.saveSystem.save(this.liveUserData);
    }

    public start(): void {
        if (AppRoot.Instance == null) {
            AppRoot.instance = this;
            director.addPersistRootNode(this.node);
            this.init();
        } else {
            this.destroy();
        }
    }

    private init(): void {
        this.saveSystem = new SaveSystem();
        this.liveUserData = this.saveSystem.load();

        this.audio.init(this.LiveUserData.soundVolume, this.LiveUserData.musicVolume);
    }
}
