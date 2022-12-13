import { Component, Label, ProgressBar, _decorator } from "cc";
import { Player } from "../Unit/Player/Player";
import { UnitLevel } from "../Unit/UnitLevel";

const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
    @property(ProgressBar) private xpBar: ProgressBar;
    @property(Label) private timeAliveText: Label;

    private playerLevel: UnitLevel;

    public init(player: Player): void {
        this.playerLevel = player.Level;
        this.playerLevel.XpAddedEvent.on(this.updateProgressBar, this);
        this.playerLevel.LevelUpEvent.on(this.updateProgressBar, this);
        this.xpBar.progress = 0;
    }

    private updateProgressBar(): void {
        this.xpBar.progress = this.playerLevel.XP / this.playerLevel.RequiredXP;
    }

    public updateTimeAlive(timeAlive: number): void {
        this.timeAliveText.string = `${Math.floor(timeAlive)}`;
    }
}
