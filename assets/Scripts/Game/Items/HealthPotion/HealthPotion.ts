import { Animation, Component, Vec3, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";

const { ccclass, property } = _decorator;

@ccclass("HealthPotion")
export class HealthPotion extends Component {
    @property(Animation) private animation: Animation;

    private pickUpEvent: Signal<HealthPotion> = new Signal<HealthPotion>();

    public setup(position: Vec3): void {
        this.node.setWorldPosition(position);
        this.node.active = true;
        this.animation.play("DropStart");
    }

    public get PickupEvent(): ISignal<HealthPotion> {
        return this.pickUpEvent;
    }

    public pickup(): void {
        this.pickUpEvent.trigger(this);
        this.node.active = false;
    }
}
