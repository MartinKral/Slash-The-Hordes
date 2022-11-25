import { Player } from "../Player/Player";
import { UpgradeType } from "./UpgradeType";

export class Upgrader {
    private player: Player;
    private typeToAction: Map<UpgradeType, () => void> = new Map<UpgradeType, () => void>();
    private typeToLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>();
    private typeToMaxLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>();

    public constructor(player: Player) {
        this.player = player;

        this.setTypeMaps(UpgradeType.WeaponLength, this.upgradeWeaponLength, 5);
        this.setTypeMaps(UpgradeType.WeaponDamage, this.upgradeWeaponDamage, 5);
    }

    public upgradeSkill(type: UpgradeType): void {
        if (!this.typeToAction.has(type)) throw new Error("Upgrade does not have " + type);
        if (this.isMaxLevel(type)) throw new Error("Upgrade is already at max level" + type);

        this.typeToAction.get(type)();
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

    private isMaxLevel(type: UpgradeType): boolean {
        return this.typeToMaxLevel.get(type) <= this.typeToLevel.get(type);
    }
}
