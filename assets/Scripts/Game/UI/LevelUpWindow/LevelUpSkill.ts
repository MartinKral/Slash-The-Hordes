import { Component, Label, NodeEventType, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { UpgradeType } from "../../Upgrades/UpgradeType";
const { ccclass, property } = _decorator;

@ccclass("LevelUpSkill")
export class LevelUpSkill extends Component {
    @property(Label) private skillTitle: Label;
    private chooseSkillEvent: Signal<UpgradeType> = new Signal<UpgradeType>();
    private skillType: UpgradeType;

    public init(skillType: UpgradeType): void {
        this.skillType = skillType;
        this.skillTitle.string = `Skill ${skillType}`;
        this.node.on(NodeEventType.MOUSE_DOWN, this.chooseSkill, this);
    }

    public get ChooseSkillEvent(): ISignal<UpgradeType> {
        return this.chooseSkillEvent;
    }

    private chooseSkill(): void {
        this.chooseSkillEvent.trigger(this.skillType);
    }
}
