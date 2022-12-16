import { instantiate, Label, Node, Prefab, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { MetaUpgradeSettings } from "../../../Game/Data/GameSettings";
import { GameData } from "../../../Game/Data/UserData";
import { MetaUpgradeType } from "../../../Game/Upgrades/UpgradeType";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { UpgradeUI } from "./UpgradeUI";

const { ccclass, property } = _decorator;

@ccclass("UpgradesModalWindow")
export class UpgradesModalWindow extends ModalWindow<Empty, Empty> {
    @property(Prefab) private upgradeButtonPrefab: Prefab;
    @property(Node) private upgradeButtonParent: Node;
    @property(Label) private goldCoinsLabel: Label;

    private gameData: GameData;

    public setup(): void {
        this.gameData = AppRoot.Instance.SaveSystem.load().game;

        const settings = AppRoot.Instance.Settings.metaUpgrades;
        const data = this.gameData.metaUpgrades;

        this.createUpgradeButton(MetaUpgradeType.Health, settings.health, data.healthLevel);
        this.createUpgradeButton(MetaUpgradeType.OverallDamage, settings.overallDamage, data.healthLevel);
        this.createUpgradeButton(MetaUpgradeType.ProjectilePiercing, settings.projectilePiercing, data.healthLevel);
        this.createUpgradeButton(MetaUpgradeType.MovementSpeed, settings.movementSpeed, data.healthLevel);
        this.createUpgradeButton(MetaUpgradeType.XPGatherer, settings.xpGatherer, data.healthLevel);
        this.createUpgradeButton(MetaUpgradeType.GoldGatherer, settings.goldGatherer, data.healthLevel);

        this.goldCoinsLabel.string = this.gameData.goldCoins.toString();
    }

    private createUpgradeButton(upgradeType: MetaUpgradeType, upgradeSettings: MetaUpgradeSettings, level: number): void {
        const upgradeButton: Node = instantiate(this.upgradeButtonPrefab);
        upgradeButton.getComponent(UpgradeUI).init(upgradeType, upgradeSettings, level, AppRoot.Instance.TranslationData);
        upgradeButton.setParent(this.upgradeButtonParent);
    }
}

export class Empty {}
