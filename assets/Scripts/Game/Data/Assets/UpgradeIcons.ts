import { Component, SpriteFrame, _decorator } from "cc";
import { UpgradeType } from "../../Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

@ccclass("UpgradeIcons")
export class UpgradeIcons extends Component {
    @property(SpriteFrame) private weaponLengthSprite: SpriteFrame;
    @property(SpriteFrame) private weaponDamageSprite: SpriteFrame;
    @property(SpriteFrame) private horizontalProjectileSprite: SpriteFrame;
    @property(SpriteFrame) private diagonalProjectileSprite: SpriteFrame;
    @property(SpriteFrame) private haloProjectileSprite: SpriteFrame;
    @property(SpriteFrame) private regenerationSprite: SpriteFrame;

    private typeToIcon = new Map<UpgradeType, SpriteFrame>();

    public init(): void {
        this.typeToIcon.set(UpgradeType.WeaponLength, this.weaponLengthSprite);
        this.typeToIcon.set(UpgradeType.WeaponDamage, this.weaponDamageSprite);
        this.typeToIcon.set(UpgradeType.HorizontalProjectile, this.horizontalProjectileSprite);
        this.typeToIcon.set(UpgradeType.DiagonalProjectile, this.diagonalProjectileSprite);
        this.typeToIcon.set(UpgradeType.HaloProjectlie, this.haloProjectileSprite);
        this.typeToIcon.set(UpgradeType.Regeneration, this.regenerationSprite);
    }

    public getIcon(upgradeType: UpgradeType): SpriteFrame {
        if (!this.typeToIcon.has(upgradeType)) throw new Error("Does not have upgrade type asset " + upgradeType);
        return this.typeToIcon.get(upgradeType);
    }
}
