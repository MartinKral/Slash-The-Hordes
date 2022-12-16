import { instantiate, Prefab, _decorator, Node } from "cc";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { UpgradeUI } from "./UpgradeUI";

const { ccclass, property } = _decorator;

@ccclass("UpgradesModalWindow")
export class UpgradesModalWindow extends ModalWindow<Empty, Empty> {
    @property(Prefab) upgradeButtonPrefab: Prefab;
    @property(Node) upgradeButtonParent: Node;

    public setup(params: Empty): void {
        for (let index = 0; index < 6; index++) {
            const upgradeButton: Node = instantiate(this.upgradeButtonPrefab);
            upgradeButton.getComponent(UpgradeUI).init("Title", "Description", 5);
            upgradeButton.setParent(this.upgradeButtonParent);
        }
    }
}

export class Empty {}
