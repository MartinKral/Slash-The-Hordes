export class GameSettings {
    public player: PlayerSettings = new PlayerSettings();
    public upgrades: UpgradeSettings = new UpgradeSettings();
    public enemyManager: EnemyManagerSettings = new EnemyManagerSettings();
}

export class PlayerSettings {
    public defaultHP = 0;
    public requiredXP: number[] = [];
    public regenerationDelay = 0;
    public collisionDelay = 0;
    public weapon: WeaponSettings = new WeaponSettings();
    public haloLauncher: HaloLauncherSettings = new HaloLauncherSettings();
    public horizontalLauncher: WaveLauncherSettings = new WaveLauncherSettings();
    public diagonalLauncher: WaveLauncherSettings = new WaveLauncherSettings();
}

export class WeaponSettings {
    public strikeDelay = 0;
    public damage = 0;
}

export class WaveLauncherSettings {
    public wavesToShootPerUpgrade = 0;
    public launcher = new ProjectileLauncherSettings();
}

export class HaloLauncherSettings {
    public projectilesToSpawn = 0;
    public cooldownDivisorPerUpgrade = 0;
    public launcher = new ProjectileLauncherSettings();
}

export class ProjectileLauncherSettings {
    public projectileLifetime = 0;
    public projectileSpeed = 0;
    public wavesToShoot = 0;
    public wavesDelayMs = 0;
    public cooldown = 0;
}

export class UpgradeSettings {
    public maxWeaponLengthUpgrades = 0;
    public maxWeaponDamageUpgrades = 0;
    public maxHorizontalProjectileUpgrades = 0;
    public maxDiagonalProjectileUpgrades = 0;
    public maxHaloProjectileUpgrades = 0;
    public maxRegenerationUpgrades = 0;
}

export class EnemyManagerSettings {
    public waveEnemySpawner = new WaveEnemySpawnerSettings();
}

export class WaveEnemySpawnerSettings {
    public cooldown = 0;
    public enemiesPerWave = 0;
    public waveLifetime = 0;
    public enemyType = "";
}
