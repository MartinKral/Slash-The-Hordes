import { Component, instantiate, Label, Node, Prefab, _decorator } from "cc";
import { MetaUpgradeSettings } from "../../../Game/Data/GameSettings";
import { TranslationData } from "../../../Game/Data/TranslationData";
import { MetaUpgradeType } from "../../../Game/Upgrades/UpgradeType";
import { formatString } from "../../../Services/Utils/StringUtils";
import { UpgradeLevelPointUI } from "./UpgradeLevelPointUI";
const { ccclass, property } = _decorator;

@ccclass("UpgradeUI")
export class UpgradeUI extends Component {
    @property(Prefab) private levelPointPrefab: Prefab;
    @property(Node) private levelPointsParent: Node;
    @property(Label) private title: Label;
    @property(Label) private description: Label;
    @property(Label) private cost: Label;

    public init(upgradeType: MetaUpgradeType, upgradeSettings: MetaUpgradeSettings, level: number, translationData: TranslationData): void {
        for (let i = 0; i < upgradeSettings.bonuses.length; i++) {
            const node: Node = instantiate(this.levelPointPrefab);
            node.setParent(this.levelPointsParent);

            const levelPointUI = node.getComponent(UpgradeLevelPointUI);
            levelPointUI.init();
            if (i < 3) {
                levelPointUI.upgrade();
            }
        }

        this.title.string = `${translationData[`${upgradeType}_TITLE`]}`;
        this.description.string = formatString(`${translationData[`${upgradeType}_DESC`]}`, [upgradeSettings.bonuses[level].toString()]);
        this.cost.string = upgradeSettings.costs[level].toString();
    }
}
