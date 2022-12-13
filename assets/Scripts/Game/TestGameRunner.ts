import { CCInteger, Component, _decorator } from "cc";
import { GameRunner } from "../Menu/GameRunner";
import { delay } from "../Services/Utils/AsyncUtils";
import { UserData } from "./Data/UserData";
import { Game } from "./Game";
const { ccclass, property } = _decorator;

@ccclass("TestGameRunner")
export class TestGameRunner extends Component {
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
        while (Game.Instance == null) await delay(100);

        const testUserData = new UserData();
        testUserData.game.metaUpgrades.maxHpLevel = this.maxHpLevel;
        testUserData.game.metaUpgrades.bonusDamageLevel = this.bonusDamageLevel;
        testUserData.game.metaUpgrades.projectilePiercingLevel = this.projectilePiercingLevel;
        testUserData.game.metaUpgrades.movementSpeedLevel = this.movementSpeedLevel;
        testUserData.game.metaUpgrades.xpGathererLevel = this.xpGathererLevel;
        testUserData.game.metaUpgrades.goldGathererLevel = this.goldGathererLevel;
        Game.Instance.playGame(testUserData);
    }
}
