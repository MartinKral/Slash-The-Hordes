import { _decorator, Component, Node, Button } from "cc";
import { type } from "os";
import { UIButton } from "../Services/UI/Button/UIButton";

import { GameRunner } from "./GameRunner";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    @property(UIButton) private playBtn: UIButton;
    @property(UIButton) private upgradeBtn: UIButton;

    public async start(): Promise<void> {
        this.playBtn.InteractedEvent.on(this.startGame, this);
        this.upgradeBtn.InteractedEvent.on(this.openUpgradesWindow, this);
    }

    private startGame(): void {
        GameRunner.Instance.playGame();
    }

    private openUpgradesWindow(): void {}
}


