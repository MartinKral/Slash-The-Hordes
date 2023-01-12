import { approx, Canvas, Component, Label, Node, _decorator } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { requireAppRootAsync } from "../AppRoot/AppRootUtils";
import { MetaUpgradeSettings } from "../Game/Data/GameSettings";
import { MetaUpgradesData } from "../Game/Data/UserData";
import { UIButton } from "../Services/UI/Button/UIButton";
import { GameRunner } from "./GameRunner";
import { MenuModalLauncher } from "./ModalWindows/MenuModalLauncher";

const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    @property(UIButton) private playBtn: UIButton;
    @property(UIButton) private upgradeBtn: UIButton;
    @property(Node) private upgradeAvailableIndicator: Node;
    @property(Node) private goldCounter: Node;
    @property(Label) private goldLabel: Label;
    @property(UIButton) private audioSettingsBtn: UIButton;
    @property(Canvas) private menuCanvas: Canvas;
    @property(Label) private highscoreLabel: Label;

    private menuModalLauncher: MenuModalLauncher;

    public async start(): Promise<void> {
        requireAppRootAsync();
        this.menuCanvas.cameraComponent = AppRoot.Instance.MainCamera;

        this.playBtn.InteractedEvent.on(this.startGame, this);
        this.upgradeBtn.InteractedEvent.on(this.openUpgradesWindow, this);
        this.audioSettingsBtn.InteractedEvent.on(this.openAudioSettingsWindow, this);

        this.menuModalLauncher = new MenuModalLauncher(AppRoot.Instance.ModalWindowManager);

        this.highscoreLabel.string = `Highscore: ${Math.floor(AppRoot.Instance.LiveUserData.game.highscore)}`;

        this.updateGoldIndicators();
    }

    private updateGoldIndicators(): void {
        this.upgradeAvailableIndicator.active = this.isUpgradeAffordable();

        const goldCoins = AppRoot.Instance.LiveUserData.game.goldCoins;
        this.goldCounter.active = 0 < goldCoins;
        this.goldLabel.string = goldCoins.toString();
    }

    private isUpgradeAffordable(): boolean {
        const goldCoins: number = AppRoot.Instance.LiveUserData.game.goldCoins;
        const metaUpgrades: MetaUpgradesData = AppRoot.Instance.LiveUserData.game.metaUpgrades;

        const metaUpgradesSettings = AppRoot.Instance.Settings.metaUpgrades;

        const costs: number[] = [];
        this.tryPushLowestCost(metaUpgrades.goldGathererLevel, metaUpgradesSettings.goldGatherer, costs);
        this.tryPushLowestCost(metaUpgrades.healthLevel, metaUpgradesSettings.health, costs);
        this.tryPushLowestCost(metaUpgrades.movementSpeedLevel, metaUpgradesSettings.movementSpeed, costs);
        this.tryPushLowestCost(metaUpgrades.overallDamageLevel, metaUpgradesSettings.overallDamage, costs);
        this.tryPushLowestCost(metaUpgrades.projectilePiercingLevel, metaUpgradesSettings.projectilePiercing, costs);
        this.tryPushLowestCost(metaUpgrades.xpGathererLevel, metaUpgradesSettings.xpGatherer, costs);

        return 0 < costs.length ? Math.min(...costs) <= goldCoins : false;
    }

    private tryPushLowestCost(upgradeLevel: number, metaUpgradeSettings: MetaUpgradeSettings, costs: number[]): void {
        if (upgradeLevel < metaUpgradeSettings.costs.length) {
            costs.push(metaUpgradeSettings.costs[upgradeLevel]);
        }
    }

    private startGame(): void {
        AppRoot.Instance.ScreenFader.playOpen();
        GameRunner.Instance.playGame();
    }

    private async openUpgradesWindow(): Promise<void> {
        await this.menuModalLauncher.openUpgradesWindow();
        this.updateGoldIndicators();
    }

    private openAudioSettingsWindow(): void {
        this.menuModalLauncher.openAudioSettingsWindow();
    }
}
