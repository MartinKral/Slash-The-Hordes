import { Component, _decorator } from "cc";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { UIButton } from "../Services/UI/Button/UIButton";
import { GameRunner } from "./GameRunner";
import { MenuModalLauncher } from "./ModalWindows/MenuModalLauncher";

const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    @property(UIButton) private playBtn: UIButton;
    @property(UIButton) private upgradeBtn: UIButton;
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;

    private menuModalLauncher: MenuModalLauncher;

    public async start(): Promise<void> {
        this.playBtn.InteractedEvent.on(this.startGame, this);
        this.upgradeBtn.InteractedEvent.on(this.openUpgradesWindow, this);

        this.menuModalLauncher = new MenuModalLauncher(this.modalWindowManager);
    }

    private startGame(): void {
        GameRunner.Instance.playGame();
    }

    private openUpgradesWindow(): void {
        this.menuModalLauncher.openUpgradesWindow();
    }
}
