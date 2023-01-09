import { UpgradeSettings } from "../Data/GameSettings";
import { Player } from "../Unit/Player/Player";
import { HaloProjectileLauncher } from "../Projectile/ProjectileLauncher/HaloProjectileLauncher";
import { WaveProjectileLauncher } from "../Projectile/ProjectileLauncher/WaveProjectileLauncher";
import { UpgradeType } from "./UpgradeType";

export class Upgrader {
    private typeToAction: Map<UpgradeType, () => void> = new Map<UpgradeType, () => void>();
    private typeToLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>();
    private typeToMaxLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>();

    public constructor(
        private player: Player,
        private horizontalProjectileLauncher: WaveProjectileLauncher,
        private haloProjectileLauncher: HaloProjectileLauncher,
        private diagonalProjectileLauncher: WaveProjectileLauncher,
        settings: UpgradeSettings
    ) {
        this.setTypeMaps(UpgradeType.WeaponLength, this.upgradeWeaponLength.bind(this), settings.maxWeaponLengthUpgrades);
        this.setTypeMaps(UpgradeType.WeaponDamage, this.upgradeWeaponDamage.bind(this), settings.maxWeaponDamageUpgrades);
        this.setTypeMaps(
            UpgradeType.HorizontalProjectile,
            this.upgradeHorizontalProjectileLauncher.bind(this),
            settings.maxHorizontalProjectileUpgrades
        );
        this.setTypeMaps(UpgradeType.DiagonalProjectile, this.upgradeDiagonalProjectileLauncher.bind(this), settings.maxDiagonalProjectileUpgrades);
        this.setTypeMaps(UpgradeType.HaloProjectlie, this.upgradeHaloProjectileLauncher.bind(this), settings.maxHaloProjectileUpgrades);
        this.setTypeMaps(UpgradeType.Regeneration, this.upgradeRegeneration.bind(this), settings.maxRegenerationUpgrades);
    }

    public upgradeSkill(type: UpgradeType): void {
        if (!this.typeToAction.has(type)) throw new Error("Upgrade does not have " + type);
        if (this.isMaxLevel(type)) throw new Error("Upgrade is already at max level " + type);

        this.typeToAction.get(type)();
        const level: number = this.typeToLevel.get(type);
        this.typeToLevel.set(type, level + 1);
    }

    public getAvailableUpgrades(): Set<UpgradeType> {
        const availableUpgrades: Set<UpgradeType> = new Set<UpgradeType>();
        for (const key of this.typeToAction.keys()) {
            if (!this.isMaxLevel(key)) {
                availableUpgrades.add(key);
            }
        }

        return availableUpgrades;
    }

    private setTypeMaps(upgradeType: UpgradeType, action: () => void, maxLevel: number): void {
        this.typeToAction.set(upgradeType, action);
        this.typeToLevel.set(upgradeType, 0);
        this.typeToMaxLevel.set(upgradeType, maxLevel);
    }

    private upgradeWeaponLength(): void {
        this.player.Weapon.upgradeWeaponLength();
    }

    private upgradeWeaponDamage(): void {
        this.player.Weapon.upgradeWeaponDamage();
    }

    private upgradeHorizontalProjectileLauncher(): void {
        this.horizontalProjectileLauncher.upgrade();
    }

    private upgradeDiagonalProjectileLauncher(): void {
        this.diagonalProjectileLauncher.upgrade();
    }

    private upgradeHaloProjectileLauncher(): void {
        this.haloProjectileLauncher.upgrade();
    }

    private upgradeRegeneration(): void {
        this.player.Regeneration.upgrade();
    }

    private isMaxLevel(type: UpgradeType): boolean {
        return this.typeToMaxLevel.get(type) <= this.typeToLevel.get(type);
    }
}
