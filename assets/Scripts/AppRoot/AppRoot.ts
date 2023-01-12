import { Camera, Component, director, instantiate, JsonAsset, Prefab, _decorator } from "cc";
import { GameSettings } from "../Game/Data/GameSettings";
import { GameAssets } from "../Game/Data/Assets/GameAssets";
import { TranslationData } from "../Game/Data/TranslationData";
import { UserData } from "../Game/Data/UserData";
import { AudioPlayer } from "../Services/AudioPlayer/AudioPlayer";
import { SaveSystem } from "./SaveSystem";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { OpenCloseAnimator } from "../Utils/OpenCloseAnimator";
import { Y8 } from "../../Plugins/Y8/Scripts/Y8";
import { Analytics } from "./Analytics";
const { ccclass, property } = _decorator;

@ccclass("AppRoot")
export class AppRoot extends Component {
    @property(AudioPlayer) private audio: AudioPlayer;
    @property(JsonAsset) private settingsAsset: JsonAsset;
    @property(JsonAsset) private engTranslationAsset: JsonAsset;
    @property(Prefab) private gameAssetsPrefab: Prefab;
    @property(Camera) private mainCamera: Camera;
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;
    @property(OpenCloseAnimator) private screenFader: OpenCloseAnimator;
    @property(Y8) private y8: Y8;

    private static instance: AppRoot;
    private saveSystem: SaveSystem;

    private liveUserData: UserData;
    private gameAssets: GameAssets;
    private analytics: Analytics;

    public static get Instance(): AppRoot {
        return this.instance;
    }

    public get AudioPlayer(): AudioPlayer {
        return this.audio;
    }

    public get GameAssets(): GameAssets {
        return this.gameAssets;
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

    public get ModalWindowManager(): ModalWindowManager {
        return this.modalWindowManager;
    }

    public get MainCamera(): Camera {
        return this.mainCamera;
    }

    public get ScreenFader(): OpenCloseAnimator {
        return this.screenFader;
    }

    public get Y8(): Y8 {
        return this.y8;
    }

    public get Analytics(): Analytics {
        return this.analytics;
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
            this.node.destroy();
        }
    }

    public update(deltaTime: number): void {
        if (this.analytics) this.analytics.update(deltaTime);
    }

    private async init(): Promise<void> {
        this.saveSystem = new SaveSystem();
        this.liveUserData = this.saveSystem.load();

        const gameAssetsNode = instantiate(this.gameAssetsPrefab);
        gameAssetsNode.setParent(this.node);
        this.gameAssets = gameAssetsNode.getComponent(GameAssets);
        this.gameAssets.init();

        this.audio.init(this.LiveUserData.soundVolume, this.LiveUserData.musicVolume);

        this.screenFader.init();
        this.screenFader.node.active = false;

        await this.y8.init();

        this.analytics = new Analytics(this.y8);
    }
}
