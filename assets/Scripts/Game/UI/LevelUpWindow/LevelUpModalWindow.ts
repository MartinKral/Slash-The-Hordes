import { instantiate, Node, Prefab, Vec3, _decorator } from "cc";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { shuffle } from "../../../Services/Utils/ArrayUtils";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { UpgradeType } from "../../Upgrades/UpgradeType";
import { LevelUpSkill } from "./LevelUpSkill";

const { ccclass, property } = _decorator;

@ccclass("LevelUpModalWindow")
export class LevelUpModalWindow extends ModalWindow<UpgradeType[], UpgradeType> {
    @property(Prefab) private skillPrefab: Prefab;
    @property(Node) private skillParent: Node;

    private maxUpgradesToPick = 3;

    protected async setup(availableUpgrades: UpgradeType[]): Promise<void> {
        const shuffledAvailableUpgrades = shuffle(availableUpgrades);
        if (this.maxUpgradesToPick < shuffledAvailableUpgrades.length) {
            shuffledAvailableUpgrades.length = this.maxUpgradesToPick;
        }
        const xPositions: number[] = [-180, 0, 180];
        await delay(300);
        for (let i = 0; i < shuffledAvailableUpgrades.length; i++) {
            await delay(500);
            const skill: LevelUpSkill = instantiate(this.skillPrefab).getComponent(LevelUpSkill);
            skill.node.setParent(this.skillParent);
            skill.node.setPosition(new Vec3(xPositions[i]));
            skill.init(shuffledAvailableUpgrades[i]);
            skill.ChooseSkillEvent.on(this.chooseSkill, this);
        }
    }

    private chooseSkill(upgradeType: UpgradeType): void {
        this.dismiss(upgradeType);
    }
}
