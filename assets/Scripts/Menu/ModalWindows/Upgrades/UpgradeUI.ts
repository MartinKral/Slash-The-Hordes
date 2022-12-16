import { Component, instantiate, Label, Node, Prefab, _decorator } from "cc";
import { UpgradeLevelPointUI } from "./UpgradeLevelPointUI";
const { ccclass, property } = _decorator;

@ccclass("UpgradeUI")
export class UpgradeUI extends Component {
    @property(Prefab) private levelPointPrefab: Prefab;
    @property(Node) private levelPointsParent: Node;
    @property(Label) private title: Label;
    @property(Label) private description: Label;
    @property(Label) private cost: Label;

    public init(titleText: string, descriptionText: string, levels: number): void {
        for (let i = 0; i < levels; i++) {
            const node: Node = instantiate(this.levelPointPrefab);
            node.setParent(this.levelPointsParent);

            const levelPointUI = node.getComponent(UpgradeLevelPointUI);
            levelPointUI.init();
            if (i < 3) {
                levelPointUI.upgrade();
            }
        }

        this.title.string = titleText;
        this.description.string = descriptionText;
        this.cost.string = "55";
    }
}
