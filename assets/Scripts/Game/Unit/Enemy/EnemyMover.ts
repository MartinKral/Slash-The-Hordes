import { Node, Vec3 } from "cc";
import { Enemy } from "./Enemy";

export class EnemyMover {
    private targetNode: Node;
    private enemies: Enemy[] = [];
    public constructor(targetNode: Node) {
        this.targetNode = targetNode;
    }
    public addEnemy(enemy: Enemy): void {
        this.enemies.push(enemy);
    }

    public removeEnemy(enemy: Enemy): void {
        const index: number = this.enemies.indexOf(enemy);
        if (index != -1) {
            this.enemies.splice(index, 1);
        }
    }

    public gameTick(deltaTime: number): void {
        this.enemies.forEach((enemy) => {
            let direction: Vec3 = new Vec3();
            direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
            enemy.moveBy(direction.multiplyScalar(deltaTime).normalize());
        });
    }
}
