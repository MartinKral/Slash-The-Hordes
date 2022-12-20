import { Animation, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PickupEffect")
export class PickupEffect extends Component {
    @property(Animation) private animation: Animation;
    public init(): void {
        this.animation.play("PickBonus");
    }
}
