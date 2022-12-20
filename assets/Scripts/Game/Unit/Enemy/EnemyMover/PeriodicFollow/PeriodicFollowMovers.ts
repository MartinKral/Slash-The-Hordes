import { Node } from "cc";
import { PeriodicFollowMoverSettings } from "../../../../Data/GameSettings";
import { Enemy } from "../../Enemy";
import { IEnemyMover } from "../EnemyMover";
import { PeriodicFollowTargetEnemyMover } from "./PeriodicFollowTargetEnemyMover";

export class PeriodicFollowMovers implements IEnemyMover {
    private enemyIdToMover = new Map<string, PeriodicFollowTargetEnemyMover>();
    public constructor(targetNode: Node, settings: PeriodicFollowMoverSettings[]) {
        for (const moverSettings of settings) {
            this.enemyIdToMover.set(
                moverSettings.enemyIdToAffect,
                new PeriodicFollowTargetEnemyMover(targetNode, moverSettings.followTime, moverSettings.waitTime)
            );
        }
    }

    public addEnemy(enemy: Enemy): void {
        this.requireEnemyMover(enemy);
        this.enemyIdToMover.get(enemy.Id).addEnemy(enemy);
    }

    public removeEnemy(enemy: Enemy): void {
        this.requireEnemyMover(enemy);
        this.enemyIdToMover.get(enemy.Id).removeEnemy(enemy);
    }

    public gameTick(deltaTime: number): void {
        for (const enemyMover of this.enemyIdToMover.values()) {
            enemyMover.gameTick(deltaTime);
        }
    }

    private requireEnemyMover(enemy: Enemy): void {
        if (!this.enemyIdToMover.has(enemy.Id)) {
            throw new Error("There is no periodic follow mover for enemy with id " + enemy.Id);
        }
    }
}
