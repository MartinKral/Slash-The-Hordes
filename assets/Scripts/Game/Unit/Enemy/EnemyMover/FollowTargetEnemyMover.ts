import { Vec3 } from "cc";
import { EnemyMover } from "./EnemyMover";

export class FollowTargetEnemyMover extends EnemyMover {
    public gameTick(deltaTime: number): void {
        this.enemies.forEach((enemy) => {
            let direction: Vec3 = new Vec3();
            direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
            enemy.gameTick(direction.normalize(), deltaTime);
        });
    }
}
