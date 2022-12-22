import { Component, SpriteFrame, _decorator } from "cc";
import { MetaUpgradeType, UpgradeType } from "../../Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

@ccclass("MetaUpgradeIcons")
export class MetaUpgradeIcons extends Component {
    @property(SpriteFrame) private healthSprite: SpriteFrame;
    @property(SpriteFrame) private overallDamageSprite: SpriteFrame;
    @property(SpriteFrame) private projectilePiercingSprite: SpriteFrame;
    @property(SpriteFrame) private movementSpeedSprite: SpriteFrame;
    @property(SpriteFrame) private xpGathererSprite: SpriteFrame;
    @property(SpriteFrame) private goldGathererSprite: SpriteFrame;

    private typeToIcon = new Map<MetaUpgradeType, SpriteFrame>();

    public init(): void {
        this.typeToIcon.set(MetaUpgradeType.Health, this.healthSprite);
        this.typeToIcon.set(MetaUpgradeType.OverallDamage, this.overallDamageSprite);
        this.typeToIcon.set(MetaUpgradeType.ProjectilePiercing, this.projectilePiercingSprite);
        this.typeToIcon.set(MetaUpgradeType.MovementSpeed, this.movementSpeedSprite);
        this.typeToIcon.set(MetaUpgradeType.XPGatherer, this.xpGathererSprite);
        this.typeToIcon.set(MetaUpgradeType.GoldGatherer, this.goldGathererSprite);
    }

    public getIcon(upgradeType: MetaUpgradeType): SpriteFrame {
        if (!this.typeToIcon.has(upgradeType)) throw new Error("Does not have upgrade type asset " + upgradeType);
        return this.typeToIcon.get(upgradeType);
    }
}
