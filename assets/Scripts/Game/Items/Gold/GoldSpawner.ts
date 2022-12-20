import { Component, Prefab, Vec3, _decorator } from "cc";
import { ObjectPool } from "../../../Services/ObjectPool";
import { Gold } from "./Gold";

const { ccclass, property } = _decorator;

@ccclass("GoldSpawner")
export class GoldSpawner extends Component {
    @property(Prefab) public goldPrefab: Prefab;

    private goldPool: ObjectPool<Gold>;
    public init(): void {
        this.goldPool = new ObjectPool<Gold>(this.goldPrefab, this.node, 5, "Gold");
    }

    public spawn(position: Vec3): void {
        const gold: Gold = this.goldPool.borrow();
        gold.setup(position);
        gold.PickupEvent.on(this.return, this);
    }

    private return(gold: Gold): void {
        gold.PickupEvent.off(this.return);
        this.goldPool.return(gold);
    }
}
