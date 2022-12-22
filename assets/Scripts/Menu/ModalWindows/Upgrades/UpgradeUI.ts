import { Component, instantiate, Label, Node, Prefab, Sprite, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { MetaUpgradeSettings } from "../../../Game/Data/GameSettings";
import { TranslationData } from "../../../Game/Data/TranslationData";
import { MetaUpgradeType } from "../../../Game/Upgrades/UpgradeType";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { UIButton } from "../../../Services/UI/Button/UIButton";
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
    @property(Label) private maxLevel: Label;
    @property(Sprite) private icon: Sprite;

    @property(UIButton) private uiButton: UIButton;

    private interactedEvent = new Signal<MetaUpgradeType>();

    private upgradeType: MetaUpgradeType;
    private upgradeSettings: MetaUpgradeSettings;
    private translationData: TranslationData;

    private levelPointUIs: UpgradeLevelPointUI[] = [];

    public init(upgradeType: MetaUpgradeType, upgradeSettings: MetaUpgradeSettings, level: number, translationData: TranslationData): void {
        this.upgradeType = upgradeType;
        this.upgradeSettings = upgradeSettings;
        this.translationData = translationData;

        this.icon.spriteFrame = AppRoot.Instance.GameAssets.MetaUpgradeIcons.getIcon(upgradeType);
        this.title.string = `${translationData[`${upgradeType}_TITLE`]}`;
        this.uiButton.InteractedEvent.on(() => this.interactedEvent.trigger(upgradeType), this);

        for (let i = 0; i < this.upgradeSettings.bonuses.length; i++) {
            const node: Node = instantiate(this.levelPointPrefab);
            node.setParent(this.levelPointsParent);

            const levelPointUI = node.getComponent(UpgradeLevelPointUI);
            levelPointUI.init();

            this.levelPointUIs.push(levelPointUI);
        }

        this.updateLevel(level);
    }

    public updateLevel(level: number): void {
        for (let i = 0; i < this.levelPointUIs.length; i++) {
            if (i < level) {
                this.levelPointUIs[i].upgrade();
            }
        }

        if (level < this.upgradeSettings.bonuses.length) {
            this.maxLevel.node.active = false;
            this.description.string = formatString(`${this.translationData[`${this.upgradeType}_DESC`]}`, [
                this.upgradeSettings.bonuses[level].toString()
            ]);
            this.cost.string = this.upgradeSettings.costs[level].toString();
        } else {
            // reached max level
            this.maxLevel.node.active = true;
            this.cost.node.active = false;
            this.description.node.active = false;
        }
    }

    public get InteractedEvent(): ISignal<MetaUpgradeType> {
        return this.interactedEvent;
    }
}
