import { MetaUpgradeSettings } from "../../Data/GameSettings";
import { MetaUpgradesData } from "../../Data/UserData";
import { MetaUpgradeType } from "../../Upgrades/UpgradeType";

export class MetaUpgrades {
    private upgradeTypeToValue = new Map<MetaUpgradeType, number>();
    public constructor(data: MetaUpgradesData, settings: MetaUpgradeSettings) {
        this.upgradeTypeToValue.set(MetaUpgradeType.MaxHp, data.maxHpLevel * settings.healthPointsPerLevel);
        this.upgradeTypeToValue.set(MetaUpgradeType.OverallDamage, data.bonusDamageLevel * settings.bonusDamagePerLevel);
        this.upgradeTypeToValue.set(MetaUpgradeType.ProjectilePiercing, data.projectilePiercingLevel * settings.projectilePiercingPerLevel);
        this.upgradeTypeToValue.set(MetaUpgradeType.MovementSpeed, data.movementSpeedLevel * settings.movementSpeedPerLevel);
        this.upgradeTypeToValue.set(MetaUpgradeType.XPGatherer, data.xpGathererLevel * settings.xpBonusPerLevel);
        this.upgradeTypeToValue.set(MetaUpgradeType.GoldGatherer, data.goldGathererLevel * settings.goldBonusPerLevel);
    }

    public getUpgradeValue(type: MetaUpgradeType): number {
        if (!this.upgradeTypeToValue.has(type)) {
            throw new Error("Does not have meta upgrade set up " + type);
        }

        return this.upgradeTypeToValue.get(type);
    }
}
