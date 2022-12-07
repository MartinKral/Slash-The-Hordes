import { _decorator, Component, Node, director, AudioSource } from "cc";
import { SaveSystem } from "./SaveSystem";
const { ccclass, property } = _decorator;

@ccclass("AppRoot")
export class AppRoot extends Component {
    @property(AudioSource) private soundSource: AudioSource;
    @property(AudioSource) private musicSource: AudioSource;

    private static instance: AppRoot;
    private saveSystem: SaveSystem;

    public static get Instance(): AppRoot {
        return this.instance;
    }

    public get SaveSystem(): SaveSystem {
        return this.saveSystem;
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
    }
}
