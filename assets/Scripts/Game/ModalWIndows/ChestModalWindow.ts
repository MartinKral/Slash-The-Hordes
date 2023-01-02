import { randomRangeInt, _decorator } from "cc";
import { ModalWindow } from "../../Services/ModalWindowSystem/ModalWindow";
import { UIButton } from "../../Services/UI/Button/UIButton";
import { LevelUpModalWindowParams } from "../UI/LevelUpWindow/LevelUpModalWindow";
import { LevelUpSkill } from "../UI/LevelUpWindow/LevelUpSkill";
import { UpgradeType } from "../Upgrades/UpgradeType";
const { ccclass, property } = _decorator;

@ccclass("ChestModalWindow")
export class ChestModalWindow extends ModalWindow<LevelUpModalWindowParams, UpgradeType> {
    @property(LevelUpSkill) private levelUpSkill: LevelUpSkill;
    @property(UIButton) private okButton: UIButton;

    protected setup(params: LevelUpModalWindowParams): void {
        const randomIndex = randomRangeInt(0, params.availableUpgrades.length - 1);
        const skillToUpgrade = params.availableUpgrades[randomIndex];
        this.levelUpSkill.init(skillToUpgrade, params.translationData);

        this.okButton.InteractedEvent.on(() => this.dismiss(skillToUpgrade), this);
    }
}
