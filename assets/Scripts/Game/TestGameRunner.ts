import { CCInteger, Component, _decorator } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { GameRunner } from "../Menu/GameRunner";
import { delay } from "../Services/Utils/AsyncUtils";
import { GameSettings, ISpawner } from "./Data/GameSettings";
import { UserData } from "./Data/UserData";
import { Game } from "./Game";
const { ccclass, property } = _decorator;

@ccclass("TestGameRunner")
export class TestGameRunner extends Component {
    @property(CCInteger) private startTime = 0;
    @property(CCInteger) private startXP = 0;

    @property(CCInteger) private maxHpLevel = 0;
    @property(CCInteger) private bonusDamageLevel = 0;
    @property(CCInteger) private projectilePiercingLevel = 0;
    @property(CCInteger) private movementSpeedLevel = 0;
    @property(CCInteger) private xpGathererLevel = 0;
    @property(CCInteger) private goldGathererLevel = 0;

    public start(): void {
        if (GameRunner.Instance.IsRunning) return;
        this.playTestGameAsync();
    }

    public async playTestGameAsync(): Promise<void> {
        while (Game.Instance == null || AppRoot.Instance == null) await delay(100);

        const testUserData = new UserData();
        testUserData.game.metaUpgrades.healthLevel = this.maxHpLevel;
        testUserData.game.metaUpgrades.overallDamageLevel = this.bonusDamageLevel;
        testUserData.game.metaUpgrades.projectilePiercingLevel = this.projectilePiercingLevel;
        testUserData.game.metaUpgrades.movementSpeedLevel = this.movementSpeedLevel;
        testUserData.game.metaUpgrades.xpGathererLevel = this.xpGathererLevel;
        testUserData.game.metaUpgrades.goldGathererLevel = this.goldGathererLevel;

        const settings = this.getTimeModifiedSettings(AppRoot.Instance.Settings);
        Game.Instance.play(testUserData, settings, AppRoot.Instance.TranslationData, { startTime: this.startTime, startXP: this.startXP });
    }

    private getTimeModifiedSettings(settings: GameSettings): GameSettings {
        const spawners: ISpawner[] = [
            ...settings.enemyManager.circularEnemySpawners,
            ...settings.enemyManager.individualEnemySpawners,
            ...settings.enemyManager.waveEnemySpawners
        ];

        for (const spawner of spawners) {
            spawner.common.startDelay -= this.startTime;
            spawner.common.stopDelay -= this.startTime;
        }

        return settings;
    }
}

export class TestValues {
    public startTime = 0;
    public startXP = 0;
}
