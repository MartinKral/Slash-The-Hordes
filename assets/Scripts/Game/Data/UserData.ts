export class UserData {
    public soundVolume = 1;
    public musicVolume = 1;
    public game = new GameData();
}

export class GameData {
    public goldCoins = 0;
    public metaUpgrades = new MetaUpgradesData();
    public highscore = 0;
}

export class MetaUpgradesData {
    public healthLevel = 0;
    public overallDamageLevel = 0;
    public projectilePiercingLevel = 0;
    public movementSpeedLevel = 0;
    public xpGathererLevel = 0;
    public goldGathererLevel = 0;
}
