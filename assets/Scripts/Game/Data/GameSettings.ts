import { EnemyProjectileLauncher } from "../Unit/Enemy/ProjectileLauncher.cs/EnemyProjectileLauncher";

export class GameSettings {
    public player: PlayerSettings = new PlayerSettings();
    public upgrades: UpgradeSettings = new UpgradeSettings();
    public metaUpgrades: MetaUpgradesSettings = new MetaUpgradesSettings();
    public enemyManager: EnemyManagerSettings = new EnemyManagerSettings();
    public items: ItemSettings = new ItemSettings();
}

export class PlayerSettings {
    public defaultHP = 0;
    public requiredXP: number[] = [];
    public speed = 0;
    public regenerationDelay = 0;
    public collisionDelay = 0;
    public magnetDuration = 0;
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

export class EnemyLauncherSettings {
    public enemyIds: string[] = [];
    public projectileLifetime = 0;
    public projectileSpeed = 0;
    public projectileDamage = 0;
    public cooldown = 0;
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

export class MetaUpgradesSettings {
    public health = new MetaUpgradeSettings();
    public overallDamage = new MetaUpgradeSettings();
    public projectilePiercing = new MetaUpgradeSettings();
    public movementSpeed = new MetaUpgradeSettings();
    public xpGatherer = new MetaUpgradeSettings();
    public goldGatherer = new MetaUpgradeSettings();
}

export class MetaUpgradeSettings {
    public costs: number[] = [];
    public bonuses: number[] = [];
}

export class EnemyManagerSettings {
    public axeLauncher = new EnemyLauncherSettings();
    public magicOrbLauncher = new EnemyLauncherSettings();
    public enemies: EnemySettings[] = [new EnemySettings()];
    public periodicFollowMovers: PeriodicFollowMoverSettings[] = [new PeriodicFollowMoverSettings()];
    public individualEnemySpawners: IndividualEnemySpawnerSettings[] = [new IndividualEnemySpawnerSettings()];
    public circularEnemySpawners: CircularEnemySpawnerSettings[] = [new CircularEnemySpawnerSettings()];
    public waveEnemySpawners: WaveEnemySpawnerSettings[] = [new WaveEnemySpawnerSettings()];
}

export class PeriodicFollowMoverSettings {
    public enemyIdToAffect = "";
    public followTime = 0;
    public waitTime = 0;
}

export class GeneralEnemySpawnerSettings {
    public enemyId = "";
    public startDelay = 0;
    public stopDelay = 0;
    public cooldown = 0;
}

export class WaveEnemySpawnerSettings implements ISpawner {
    public common = new GeneralEnemySpawnerSettings();
    public enemiesToSpawn = 0;
}

export class CircularEnemySpawnerSettings implements ISpawner {
    public common = new GeneralEnemySpawnerSettings();
    public enemiesToSpawn = 0;
}

export class IndividualEnemySpawnerSettings implements ISpawner {
    public common = new GeneralEnemySpawnerSettings();
}

export interface ISpawner {
    common: GeneralEnemySpawnerSettings;
}

export class EnemySettings {
    public id = "";
    public moveType = "";
    public graphicsType = "";
    public health = 0;
    public damage = 0;
    public speed = 0;
    public lifetime = 0;

    public xpReward = 0;
    public goldReward = 0;
    public healthPotionRewardChance = 0;
    public magnetRewardChance = 0;
    public chestRewardChance = 0;
}

export class ItemSettings {
    public healthPerPotion = 0;
}
