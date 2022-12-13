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
    public bonusDamageLevel = 2;
    public projectilePiercingLevel = 0;
    public movementSpeedLevel = 0;
    public xpGathererLevel = 0;
    public goldGathererLevel = 0;
}
