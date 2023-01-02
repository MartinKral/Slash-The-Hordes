import { _decorator, Component, Node, Prefab } from "cc";

import { ObjectPool } from "../../../../Services/ObjectPool";
import { delay } from "../../../../Services/Utils/AsyncUtils";
import { Enemy } from "../Enemy";
import { EnemyManager } from "../EnemyManager";
import { EnemyDeathEffect } from "./EnemyDeathEffect";
const { ccclass, property } = _decorator;

@ccclass("EnemyDeathEffectSpawner")
export class EnemyDeathEffectSpawner extends Component {
    @property(Prefab) private deathEffectPrefab: Prefab;

    private effectPool: ObjectPool<EnemyDeathEffect>;

    public init(enemyManager: EnemyManager): void {
        enemyManager.EnemyAddedEvent.on(this.onEnemyAdded, this);
        enemyManager.EnemyRemovedEvent.on(this.onEnemyRemoved, this);

        this.effectPool = new ObjectPool(this.deathEffectPrefab, this.node, 5, "EnemyDeathEffect");
    }

    private onEnemyAdded(enemy: Enemy): void {
        enemy.DeathEvent.on(this.animateDeathEffect, this);
    }

    private onEnemyRemoved(enemy: Enemy): void {
        enemy.DeathEvent.off(this.animateDeathEffect);
    }

    private async animateDeathEffect(enemy: Enemy): Promise<void> {
        const deathEffect = this.effectPool.borrow();
        deathEffect.setup(enemy.node.worldPosition);

        await delay(360);

        this.effectPool.return(deathEffect);
    }
}
