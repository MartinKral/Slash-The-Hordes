import { Vec3 } from "cc";
import { Enemy } from "../Enemy";
import { EnemyMover } from "./EnemyMover";

export class WaveEnemyMover extends EnemyMover {
    private enemyToDirection: Map<Enemy, Vec3> = new Map<Enemy, Vec3>();
    private lastTargetPosition: Vec3 = new Vec3();
    private lastDirection: Vec3 = new Vec3();

    public addEnemy(enemy: Enemy): void {
        let direction: Vec3 = new Vec3();

        // if the enemy is added soon enough, move as a single group towards one direction
        if (Vec3.equals(this.lastTargetPosition, this.targetNode.worldPosition)) {
            direction = this.lastDirection;
        } else {
            direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
            this.lastDirection = direction;
            this.lastTargetPosition = this.targetNode.worldPosition.clone();
        }

        this.enemyToDirection.set(enemy, direction.normalize());
        super.addEnemy(enemy);
    }

    public removeEnemy(enemy: Enemy): void {
        this.enemyToDirection.delete(enemy);
        super.removeEnemy(enemy);
    }

    public gameTick(deltaTime: number): void {
        for (const enemyAndDirection of this.enemyToDirection) {
            enemyAndDirection[0].gameTick(enemyAndDirection[1], deltaTime);
        }
    }
}
