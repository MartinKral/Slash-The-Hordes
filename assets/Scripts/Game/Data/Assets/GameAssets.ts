import { _decorator, Component, Node } from "cc";
import { AudioAssets } from "./AudioAssets";
import { MetaUpgradeIcons } from "./MetaUpgradeIcons";
import { UpgradeIcons } from "./UpgradeIcons";
const { ccclass, property } = _decorator;

@ccclass("GameAssets")
export class GameAssets extends Component {
    @property(UpgradeIcons) private upgradeIcons: UpgradeIcons;
    @property(MetaUpgradeIcons) private metaUpgradeIcons: MetaUpgradeIcons;
    @property(AudioAssets) private audioAssets: AudioAssets;

    public init(): void {
        this.upgradeIcons.init();
        this.metaUpgradeIcons.init();
    }

    public get UpgradeIcons(): UpgradeIcons {
        return this.upgradeIcons;
    }

    public get MetaUpgradeIcons(): MetaUpgradeIcons {
        return this.metaUpgradeIcons;
    }

    public get AudioAssets(): AudioAssets {
        return this.audioAssets;
    }
}
