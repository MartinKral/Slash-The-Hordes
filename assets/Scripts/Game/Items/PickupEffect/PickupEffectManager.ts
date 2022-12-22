import { _decorator, Component, Node, Prefab, Vec3 } from "cc";
import { ObjectPool } from "../../../Services/ObjectPool";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { PickupEffect } from "./PickupEffect";
const { ccclass, property } = _decorator;

@ccclass("PickupEffectManager")
export class PickupEffectManager extends Component {
    @property(Prefab) private pickupEffect: Prefab;

    private effectPool: ObjectPool<PickupEffect>;

    public init(): void {
        this.effectPool = new ObjectPool(this.pickupEffect, this.node, 5, "PickupEffect");
    }

    public async showEffect(position: Vec3): Promise<void> {
        const effect = this.effectPool.borrow();
        effect.node.setWorldPosition(position);
        effect.node.active = true;

        await delay(450);

        this.effectPool?.return(effect);
    }
}
