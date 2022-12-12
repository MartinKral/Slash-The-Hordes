import { Component, _decorator } from "cc";
import { GameRunner } from "../Menu/GameRunner";
import { delay } from "../Services/Utils/AsyncUtils";
import { Game } from "./Game";
const { ccclass } = _decorator;

@ccclass("TestGameRunner")
export class TestGameRunner extends Component {
    public start(): void {
        if (GameRunner.Instance.IsRunning) return;
        this.playTestGameAsync();
    }

    public async playTestGameAsync(): Promise<void> {
        while (Game.Instance == null) await delay(100);
        Game.Instance.playGame();
    }
}
