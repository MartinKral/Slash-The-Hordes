import { Animation, Component, Vec3, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";

const { ccclass, property } = _decorator;

@ccclass("XP")
export class XP extends Component {
    @property(Animation) private animation: Animation;

    private pickUpEvent: Signal<XP> = new Signal<XP>();
    private value = 2;

    public setup(position: Vec3, value: number): void {
        this.node.setWorldPosition(position);
        this.value = value;
        this.node.active = true;
        this.animation.play("DropStart");
    }

    public get Value(): number {
        return this.value;
    }

    public get PickupEvent(): ISignal<XP> {
        return this.pickUpEvent;
    }

    public pickup(): void {
        this.pickUpEvent.trigger(this);
        this.node.active = false;
    }
}
