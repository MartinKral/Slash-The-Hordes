import { Component, Prefab, Vec3, _decorator } from "cc";
import { ObjectPool } from "../../../Services/ObjectPool";

import { XP } from "./XP";
const { ccclass, property } = _decorator;

@ccclass("XPSpawner")
export class XPSpawner extends Component {
    @property(Prefab) public xpPrefab: Prefab;

    private xpPool: ObjectPool<XP>;
    public init(): void {
        this.xpPool = new ObjectPool<XP>(this.xpPrefab, this.node, 5, "XP");
    }

    public spawnXp(position: Vec3, value: number): void {
        const xp: XP = this.xpPool.borrow();
        xp.setup(position, value);
        xp.PickupEvent.on(this.returnXp, this);
    }

    private returnXp(xp: XP): void {
        xp.PickupEvent.off(this.returnXp);
        this.xpPool.return(xp);
    }
}
