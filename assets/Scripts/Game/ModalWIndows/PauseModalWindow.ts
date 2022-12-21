import { _decorator } from "cc";
import { MenuModalWindowTypes } from "../../Menu/ModalWindows/MenuModalWindowTypes";
import { ModalWindow } from "../../Services/ModalWindowSystem/ModalWindow";
import { ModalWindowManager } from "../../Services/ModalWindowSystem/ModalWindowManager";
import { UIButton } from "../../Services/UI/Button/UIButton";

const { ccclass, property } = _decorator;

@ccclass("PauseModalWindow")
export class PauseModalWindow extends ModalWindow<ModalWindowManager, boolean> {
    @property(UIButton) private continueBtn: UIButton;
    @property(UIButton) private audioSettingsButton: UIButton;
    @property(UIButton) private exitBtn: UIButton;

    private modalWindowManager: ModalWindowManager;

    protected setup(modalWindowManager: ModalWindowManager): void {
        this.modalWindowManager = modalWindowManager;

        this.continueBtn.InteractedEvent.on(this.continueGame, this);
        this.audioSettingsButton.InteractedEvent.on(this.openSettingsWindow, this);
        this.exitBtn.InteractedEvent.on(this.exitGame, this);
    }

    private openSettingsWindow(): void {
        this.modalWindowManager.showModal(MenuModalWindowTypes.AudioSettings, {});
    }

    private continueGame(): void {
        this.dismiss(false);
    }

    private exitGame(): void {
        this.dismiss(true);
    }
}
