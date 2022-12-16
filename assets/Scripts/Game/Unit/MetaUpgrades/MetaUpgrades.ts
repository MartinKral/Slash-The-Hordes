import { MetaUpgradesSettings } from "../../Data/GameSettings";
import { MetaUpgradesData } from "../../Data/UserData";
import { MetaUpgradeType } from "../../Upgrades/UpgradeType";

export class MetaUpgrades {
    private upgradeTypeToValue = new Map<MetaUpgradeType, number>();
    public constructor(data: MetaUpgradesData, settings: MetaUpgradesSettings) {
        this.upgradeTypeToValue.set(MetaUpgradeType.Health, this.getBonusValue(data.healthLevel, settings.health.bonuses));
        this.upgradeTypeToValue.set(MetaUpgradeType.OverallDamage, this.getBonusValue(data.overallDamageLevel, settings.overallDamage.bonuses));
        this.upgradeTypeToValue.set(
            MetaUpgradeType.ProjectilePiercing,
            this.getBonusValue(data.projectilePiercingLevel, settings.projectilePiercing.bonuses)
        );
        this.upgradeTypeToValue.set(MetaUpgradeType.MovementSpeed, this.getBonusValue(data.movementSpeedLevel, settings.movementSpeed.bonuses));
        this.upgradeTypeToValue.set(MetaUpgradeType.XPGatherer, this.getBonusValue(data.xpGathererLevel, settings.xpGatherer.bonuses));
        this.upgradeTypeToValue.set(MetaUpgradeType.GoldGatherer, this.getBonusValue(data.goldGathererLevel, settings.goldGatherer.bonuses));
    }

    private getBonusValue(level: number, bonuses: number[]): number {
        if (level <= 0) return 0;
        if (bonuses.length < level) throw new Error(`Meta upgrade does not have settings for level ${level}`);

        return bonuses[level - 1];
    }

    public getUpgradeValue(type: MetaUpgradeType): number {
        if (!this.upgradeTypeToValue.has(type)) {
            throw new Error("Does not have meta upgrade set up " + type);
        }

        return this.upgradeTypeToValue.get(type);
    }
}
