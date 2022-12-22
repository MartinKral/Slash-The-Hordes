import { AudioClip, instantiate, Label, Node, Prefab, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { MetaUpgradeSettings } from "../../../Game/Data/GameSettings";
import { MetaUpgradesData, UserData } from "../../../Game/Data/UserData";
import { MetaUpgradeType } from "../../../Game/Upgrades/UpgradeType";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { UpgradeUI } from "./UpgradeUI";

const { ccclass, property } = _decorator;

@ccclass("UpgradesModalWindow")
export class UpgradesModalWindow extends ModalWindow<Empty, Empty> {
    @property(Prefab) private upgradeButtonPrefab: Prefab;
    @property(Node) private upgradeButtonParent: Node;
    @property(Label) private goldCoinsLabel: Label;
    @property(AudioClip) private upgradeAudioClip: AudioClip;

    private typeToLevel = new Map<MetaUpgradeType, number>();
    private typeToCosts = new Map<MetaUpgradeType, number[]>();
    private typeToLevelKey = new Map<MetaUpgradeType, keyof MetaUpgradesData>();
    private typeToUpgradeUI = new Map<MetaUpgradeType, UpgradeUI>();

    private userData: UserData;

    public setup(): void {
        this.userData = AppRoot.Instance.LiveUserData;
        const settings = AppRoot.Instance.Settings.metaUpgrades;

        this.createUpgradeButton(MetaUpgradeType.Health, settings.health, "healthLevel");
        this.createUpgradeButton(MetaUpgradeType.OverallDamage, settings.overallDamage, "overallDamageLevel");
        this.createUpgradeButton(MetaUpgradeType.ProjectilePiercing, settings.projectilePiercing, "projectilePiercingLevel");
        this.createUpgradeButton(MetaUpgradeType.MovementSpeed, settings.movementSpeed, "movementSpeedLevel");
        this.createUpgradeButton(MetaUpgradeType.XPGatherer, settings.xpGatherer, "xpGathererLevel");
        this.createUpgradeButton(MetaUpgradeType.GoldGatherer, settings.goldGatherer, "goldGathererLevel");

        this.goldCoinsLabel.string = this.userData.game.goldCoins.toString();
    }

    private createUpgradeButton<T extends keyof MetaUpgradesData>(
        upgradeType: MetaUpgradeType,
        upgradeSettings: MetaUpgradeSettings,
        levelKey: T
    ): void {
        const upgradeButton: Node = instantiate(this.upgradeButtonPrefab);
        const upgradeUI: UpgradeUI = upgradeButton.getComponent(UpgradeUI);

        upgradeUI.init(upgradeType, upgradeSettings, this.userData.game.metaUpgrades[levelKey], AppRoot.Instance.TranslationData);
        upgradeUI.InteractedEvent.on(this.tryUpgrade, this);
        upgradeButton.setParent(this.upgradeButtonParent);

        this.typeToLevel.set(upgradeType, this.userData.game.metaUpgrades[levelKey]);
        this.typeToCosts.set(upgradeType, upgradeSettings.costs);
        this.typeToLevelKey.set(upgradeType, levelKey);
        this.typeToUpgradeUI.set(upgradeType, upgradeUI);
    }

    private tryUpgrade(upgradeType: MetaUpgradeType): void {
        console.log("Trying to upgrade " + upgradeType);

        const costs: number[] = this.typeToCosts.get(upgradeType);
        const currentLevel: number = this.typeToLevel.get(upgradeType);

        if (costs.length <= currentLevel) return; // already max level
        if (this.userData.game.goldCoins < costs[currentLevel]) return; // not enough gold

        AppRoot.Instance.AudioPlayer.playSound(this.upgradeAudioClip);

        this.userData.game.goldCoins -= costs[currentLevel];
        const level = ++this.userData.game.metaUpgrades[this.typeToLevelKey.get(upgradeType)];
        this.typeToUpgradeUI.get(upgradeType).updateLevel(level);
        this.typeToLevel.set(upgradeType, level);

        this.goldCoinsLabel.string = this.userData.game.goldCoins.toString();
        AppRoot.Instance.saveUserData();
    }
}

export class Empty {}
