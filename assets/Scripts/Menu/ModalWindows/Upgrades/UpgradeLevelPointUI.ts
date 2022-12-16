import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UpgradeLevelPointUI")
export class UpgradeLevelPointUI extends Component {
    @property(Node) private upgradedGraphics: Node;

    public init(): void {
        this.upgradedGraphics.active = false;
    }

    public upgrade(): void {
        this.upgradedGraphics.active = true;
    }
}
