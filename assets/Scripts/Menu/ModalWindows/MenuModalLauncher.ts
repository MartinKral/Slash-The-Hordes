import { ModalWindowManager } from "../../Services/ModalWindowSystem/ModalWindowManager";
import { MenuModalWindowTypes } from "./MenuModalWindowTypes";

export class MenuModalLauncher {
    public constructor(private modalWindowManager: ModalWindowManager) {}

    public async openUpgradesWindow(): Promise<void> {
        await this.modalWindowManager.showModal(MenuModalWindowTypes.Upgrades, {});
    }

    public async openAudioSettingsWindow(): Promise<void> {
        await this.modalWindowManager.showModal(MenuModalWindowTypes.AudioSettings, {});
    }
}
