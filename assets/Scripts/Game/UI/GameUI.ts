import { Component, Label, ProgressBar, _decorator } from "cc";
import { UIButton } from "../../Services/UI/Button/UIButton";
import { GameResult } from "../Game";
import { ItemManager } from "../Items/ItemManager";
import { ItemType } from "../Items/ItemType";
import { GameModalLauncher } from "../ModalWIndows/GameModalLauncher";
import { Player } from "../Unit/Player/Player";
import { UnitLevel } from "../Unit/UnitLevel";

const { ccclass, property } = _decorator;

@ccclass("GameUI")
export class GameUI extends Component {
    @property(ProgressBar) private xpBar: ProgressBar;
    @property(Label) private timeAliveText: Label;
    @property(Label) private goldLabel: Label;
    @property(UIButton) private pauseBtn: UIButton;

    private playerLevel: UnitLevel;
    private modalLauncher: GameModalLauncher;
    private gameResult: GameResult;

    public init(player: Player, modalLauncher: GameModalLauncher, itemManager: ItemManager, gameResult: GameResult): void {
        this.playerLevel = player.Level;
        this.modalLauncher = modalLauncher;
        this.gameResult = gameResult;

        this.playerLevel.XpAddedEvent.on(this.updateProgressBar, this);
        this.playerLevel.LevelUpEvent.on(this.updateProgressBar, this);

        itemManager.PickupEvent.on(this.tryUpdateGoldLabel, this);

        this.xpBar.progress = 0;

        this.pauseBtn.InteractedEvent.on(this.showPauseWindow, this);
    }

    private updateProgressBar(): void {
        this.xpBar.progress = this.playerLevel.XP / this.playerLevel.RequiredXP;
    }

    private tryUpdateGoldLabel(itemType: ItemType): void {
        if (itemType !== ItemType.Gold) return;

        this.goldLabel.string = this.gameResult.goldCoins.toString();
    }

    private showPauseWindow(): void {
        console.log("Show pause window");
        this.modalLauncher.showPauseModal();
    }

    public updateTimeAlive(timeAlive: number): void {
        this.timeAliveText.string = `${Math.floor(timeAlive)}`;
    }
}
