import { Component, instantiate, Label, Node, Prefab, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UpgradeUI")
export class UpgradeUI extends Component {
    @property(Prefab) private levelPointPrefab: Prefab;
    @property(Node) private levelPointsParent: Node;
    @property(Label) private title: Label;
    @property(Label) private description: Label;

    public init(titleText: string, descriptionText: string, levels: number): void {
        for (let i = 0; i < levels; i++) {
            const node: Node = instantiate(this.levelPointPrefab);
            node.setParent(this.levelPointsParent);
        }

        this.title.string = titleText;
        this.description.string = descriptionText;
    }
}
