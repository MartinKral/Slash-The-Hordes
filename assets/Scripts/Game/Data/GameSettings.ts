export class GameSettings {
    public playerSettings: PlayerSettings = new PlayerSettings();
    public weaponSettings: WeaponSettings = new WeaponSettings();
}

export class PlayerSettings {
    public defaultHP = 0;
    public requiredXP: number[] = [];
    public collisionDelay = 0;
    public testSettings = new TestSettings();
}

export class WeaponSettings {
    public strikeDelay = 0;
}

export class TestSettings {
    public test = 0;
}
