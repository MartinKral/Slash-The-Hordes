import { Canvas, Component, _decorator } from "cc";
import { AppRoot } from "../AppRoot/AppRoot";
import { requireAppRootAsync } from "../AppRoot/AppRootUtils";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { UIButton } from "../Services/UI/Button/UIButton";
import { OpenCloseAnimator } from "../Utils/OpenCloseAnimator";
import { GameRunner } from "./GameRunner";
import { MenuModalLauncher } from "./ModalWindows/MenuModalLauncher";

const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    @property(UIButton) private playBtn: UIButton;
    @property(UIButton) private upgradeBtn: UIButton;
    @property(UIButton) private audioSettingsBtn: UIButton;
    @property(Canvas) private menuCanvas: Canvas;

    private menuModalLauncher: MenuModalLauncher;

    public async start(): Promise<void> {
        requireAppRootAsync();
        this.menuCanvas.cameraComponent = AppRoot.Instance.MainCamera;

        this.playBtn.InteractedEvent.on(this.startGame, this);
        this.upgradeBtn.InteractedEvent.on(this.openUpgradesWindow, this);
        this.audioSettingsBtn.InteractedEvent.on(this.openAudioSettingsWindow, this);

        this.menuModalLauncher = new MenuModalLauncher(AppRoot.Instance.ModalWindowManager);
    }

    private startGame(): void {
        AppRoot.Instance.ScreenFader.playOpen();
        GameRunner.Instance.playGame();
    }

    private openUpgradesWindow(): void {
        this.menuModalLauncher.openUpgradesWindow();
    }

    private openAudioSettingsWindow(): void {
        this.menuModalLauncher.openAudioSettingsWindow();
    }
}
