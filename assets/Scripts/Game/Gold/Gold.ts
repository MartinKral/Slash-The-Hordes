import { Component, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
const { ccclass, property } = _decorator;

@ccclass("Gold")
export class Gold extends Component {
    private pickUpEvent: Signal<Gold> = new Signal<Gold>();

    public setup(position: Vec3): void {
        this.node.setWorldPosition(position);
        this.node.active = true;
    }

    public get PickupEvent(): ISignal<Gold> {
        return this.pickUpEvent;
    }

    public pickup(): void {
        this.pickUpEvent.trigger(this);
        this.node.active = false;
    }
}
