export class GameSettings {
    public player: PlayerSettings = new PlayerSettings();
    public weapon: WeaponSettings = new WeaponSettings();
    public upgrades: UpgradeSettings = new UpgradeSettings();
}

export class PlayerSettings {
    public defaultHP = 0;
    public requiredXP: number[] = [];
    public regenerationDelay = 0;
    public collisionDelay = 0;
}

export class WeaponSettings {
    public strikeDelay = 0;
    public damage = 0;
}

export class UpgradeSettings {
    public maxWeaponLengthUpgrades = 0;
    public maxWeaponDamageUpgrades = 0;
    public maxHorizontalProjectileUpgrades = 0;
    public maxVerticalProjectileUpgrades = 0;
    public maxRegenerationUpgrades = 0;
}
