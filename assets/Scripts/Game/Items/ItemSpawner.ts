import { Component, Prefab, Vec3, _decorator } from "cc";
import { ObjectPool } from "../../Services/ObjectPool";
import { Item } from "./Item";

const { ccclass, property } = _decorator;

@ccclass("ItemSpawner")
export class ItemSpawner extends Component {
    @property(Prefab) public itemPrefab: Prefab;

    private itemPool: ObjectPool<Item>;
    public init(): void {
        this.itemPool = new ObjectPool<Item>(this.itemPrefab, this.node, 5, "Item");
    }

    public spawn(position: Vec3): void {
        const item: Item = this.itemPool.borrow();
        item.setup(position);
        item.PickupEvent.on(this.return, this);
    }

    private return(item: Item): void {
        item.PickupEvent.off(this.return);
        this.itemPool.return(item);
    }
}
