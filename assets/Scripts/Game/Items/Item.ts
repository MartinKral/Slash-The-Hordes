import { _decorator, Component, Node, Vec3, ccenum, Enum } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ItemType } from "./ItemType";
const { ccclass, property } = _decorator;

@ccclass("Item")
export class Item extends Component {
    @property({ type: Enum(ItemType) }) private itemType: ItemType;

    private pickUpEvent = new Signal<Item>();

    public get ItemType(): ItemType {
        return <ItemType>this.itemType;
    }

    public setup(position: Vec3): void {
        this.node.setWorldPosition(position);
        this.node.active = true;
    }

    public get PickupEvent(): ISignal<Item> {
        return this.pickUpEvent;
    }

    public pickup(): void {
        this.pickUpEvent.trigger(this);
        this.node.active = false;
    }
}
