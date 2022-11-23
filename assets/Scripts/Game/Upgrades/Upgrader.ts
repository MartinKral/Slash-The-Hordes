import { Player } from "../Player/Player";
import { UpgradeType } from "./UpgradeType";

export class Upgrader {
    private player: Player;
    private typeToAction: Map<UpgradeType, () => void> = new Map<UpgradeType, () => void>();
    private typeToLevel: Map<UpgradeType, number> = new Map<UpgradeType, number>();

    public constructor(player: Player) {
        this.player = player;

        this.typeToAction.set(UpgradeType.MaxHP, this.upgradeMaxHp);
        this.typeToAction.set(UpgradeType.WeaponLength, this.upgradeWeaponLength);
        this.typeToAction.set(UpgradeType.WeaponDamage, this.upgradeWeaponDamage);

        this.typeToLevel.set(UpgradeType.MaxHP, 0);
        this.typeToLevel.set(UpgradeType.WeaponLength, 0);
    }

    public upgradeSkill(type: UpgradeType): void {
        if (!this.typeToAction.has(type)) throw new Error("Upgrade does not have " + type);
        this.typeToAction.get(type)();
    }

    private upgradeMaxHp(): void {
        const healthIncrease = 5;
        const currentMax: number = this.player.Health.MaxHealthPoints;
        this.player.Health.setMaxHealth(currentMax + healthIncrease);
        this.player.Health.heal(healthIncrease);
    }

    private upgradeWeaponLength(): void {
        this.player.Weapon.upgradeWeaponLength();
    }

    private upgradeWeaponDamage(): void {
        this.player.Weapon.upgradeWeaponDamage();
    }
}
