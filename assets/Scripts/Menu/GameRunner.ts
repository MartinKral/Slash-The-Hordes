import { director } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { UserData } from "../Game/Data/UserData";
import { Game, GameResult } from "../Game/Game";
import { delay } from "../Services/Utils/AsyncUtils";

export class GameRunner {
    private static instance: GameRunner = new GameRunner();

    private isRunning = false;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static get Instance(): GameRunner {
        return this.instance;
    }

    public get IsRunning(): boolean {
        return this.isRunning;
    }

    public async playGame(): Promise<void> {
        this.isRunning = true;
        director.loadScene("Game");
        const userData: UserData = AppRoot.Instance.LiveUserData;
        while (Game.Instance == null) await delay(10);
        const result: GameResult = await Game.Instance.play(userData, AppRoot.Instance.Settings, AppRoot.Instance.TranslationData);
        userData.game.goldCoins += result.goldCoins;

        if (userData.game.highscore < result.score) {
            userData.game.highscore = result.score;
        }
        AppRoot.Instance.saveUserData();
        director.loadScene("Menu");

        this.isRunning = false;
    }
}
