import { instantiate, Node, Prefab, Vec3, _decorator } from "cc";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { UpgradeType } from "../../Upgrades/UpgradeType";
import { LevelUpSkill } from "./LevelUpSkill";

const { ccclass, property } = _decorator;

@ccclass("LevelUpModalWindow")
export class LevelUpModalWindow extends ModalWindow<string, UpgradeType> {
    @property(Prefab) private skillPrefab: Prefab;
    @property(Node) private skillParent: Node;

    protected async setup(params: string): Promise<void> {
        const xPositions: number[] = [-180, 0, 180];
        await delay(300);
        for (let i = 0; i < 3; i++) {
            await delay(500);
            const skill: LevelUpSkill = instantiate(this.skillPrefab).getComponent(LevelUpSkill);
            skill.node.setParent(this.skillParent);
            skill.node.setPosition(new Vec3(xPositions[i]));
            skill.init(params);
            skill.ChooseSkillEvent.on(this.chooseSkill, this);
        }
    }

    private chooseSkill(skill: LevelUpSkill): void {
        this.dismiss(UpgradeType.WeaponDamage);
    }
}
