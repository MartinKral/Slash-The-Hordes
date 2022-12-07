import { director } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { UserData } from "../Game/Data/UserData";
import { Game } from "../Game/Game";
import { delay } from "../Services/Utils/AsyncUtils";

export class GameRunner {
    private static instance: GameRunner = new GameRunner();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static get Instance(): GameRunner {
        return this.instance;
    }

    public async playGame(): Promise<void> {
        director.loadScene("Game");
        const userData: UserData = AppRoot.Instance.SaveSystem.load();
        while (Game.Instance == null) await delay(10);
        const result: number = await Game.Instance.playGame();
        userData.game.goldCoins += result;
        AppRoot.Instance.SaveSystem.save(userData);

        console.log("Gold  coins: " + result);
        console.log("All gold coins: " + userData.game.goldCoins);
    }
}
