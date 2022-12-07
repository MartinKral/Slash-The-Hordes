export class UserData {
    public soundVolume = 0;
    public musicVolume = 0;
    public game = new GameData();
}

export class GameData {
    public goldCoins = 0;
    public metaUpgrades = new MetaUpgradesData();
}

export class MetaUpgradesData {
    public maxHpLevel = 0;
    public overallDamageLevel = 0;
    public projectilePiercingLevel = 0;
    public movementSpeedLevel = 0;
}
