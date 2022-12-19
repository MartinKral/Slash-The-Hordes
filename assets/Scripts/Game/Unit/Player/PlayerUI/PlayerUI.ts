import { Component, _decorator } from "cc";
import { UnitHealth } from "../../UnitHealth";
import { PlayerHealthUI } from "./PlayerHealthUI";
const { ccclass, property } = _decorator;

@ccclass("PlayerUI")
export class PlayerUI extends Component {
    @property(PlayerHealthUI) private healthUI: PlayerHealthUI;

    public init(playerHealth: UnitHealth): void {
        this.healthUI.init(playerHealth);
    }
}
