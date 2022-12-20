import { Component, director, JsonAsset, _decorator } from "cc";
import { GameSettings } from "../Game/Data/GameSettings";
import { TranslationData } from "../Game/Data/TranslationData";
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

    public static get Instance(): AppRoot {
        return this.instance;
    }

    public get AudioPlayer(): AudioPlayer {
        return this.audio;
    }

    public get SaveSystem(): SaveSystem {
        return this.saveSystem;
    }

    public get Settings(): GameSettings {
        return <GameSettings>this.settingsAsset.json;
    }

    public get TranslationData(): TranslationData {
        return <TranslationData>this.engTranslationAsset.json;
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
        this.audio.init(1, 1);
    }
}
