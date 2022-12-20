import { Node } from "cc";
import { Enemy } from "../Enemy";

export abstract class EnemyMover implements IEnemyMover {
    protected targetNode: Node;
    protected enemies: Enemy[] = [];

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

    public abstract gameTick(deltaTime: number): void;
}

export interface IEnemyMover {
    addEnemy(enemy: Enemy): void;
    removeEnemy(enemy: Enemy): void;
    gameTick(deltaTime: number): void;
}
