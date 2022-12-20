import { Component, Prefab, Vec3, _decorator } from "cc";
import { ObjectPool } from "../../../Services/ObjectPool";
import { HealthPotion } from "./HealthPotion";

const { ccclass, property } = _decorator;

@ccclass("HealthPotionSpawner")
export class HealthPotionSpawner extends Component {
    @property(Prefab) public healthPotionPrefab: Prefab;

    private healthPotionPool: ObjectPool<HealthPotion>;

    public init(): void {
        this.healthPotionPool = new ObjectPool<HealthPotion>(this.healthPotionPrefab, this.node, 5, "HealthPotion");
    }

    public spawn(position: Vec3): void {
        const healthPotion: HealthPotion = this.healthPotionPool.borrow();
        healthPotion.setup(position);
        healthPotion.PickupEvent.on(this.return, this);
    }

    private return(healthPotion: HealthPotion): void {
        healthPotion.PickupEvent.off(this.return);
        this.healthPotionPool.return(healthPotion);
    }
}
