import { ModalWindowManager } from "../../Services/ModalWindowSystem/ModalWindowManager";
import { Pauser } from "../Pauser";
import { Player } from "../Unit/Player/Player";
import { Upgrader } from "../Upgrades/Upgrader";
import { UpgradeType } from "../Upgrades/UpgradeType";
import { GameModalWindowTypes } from "./GameModalWindowTypes";

export class GameModalLauncher {
    public constructor(
        private modalWindowManager: ModalWindowManager,
        private player: Player,
        private gamePauser: Pauser,
        private upgrader: Upgrader
    ) {
        this.player.Level.LevelUpEvent.on(this.showLevelUpModal, this);
    }

    private async showLevelUpModal(): Promise<void> {
        this.gamePauser.pause();
        const skillToUpgrade: UpgradeType = await this.modalWindowManager.showModal<UpgradeType[], UpgradeType>(
            GameModalWindowTypes.LevelUpModal,
            Array.from(this.upgrader.getAvailableUpgrades())
        );
        this.gamePauser.resume();
        this.upgrader.upgradeSkill(skillToUpgrade);
    }
}
