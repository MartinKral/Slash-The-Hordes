import { Component, ProgressBar, _decorator } from "cc";
import { Player } from "../Player/Player";
import { UnitLevel } from "../Player/UnitLevel";
const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
    @property(ProgressBar) private xpBar: ProgressBar;

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
}
