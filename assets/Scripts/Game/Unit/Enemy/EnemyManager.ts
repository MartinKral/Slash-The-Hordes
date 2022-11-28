import { Component, Node, _decorator } from "cc";
import { XPSpawner } from "../../XP/XPSpawner";
import { Enemy } from "./Enemy";
import { EnemyMover } from "./EnemyMover";
import { EnemySpawner } from "./EnemySpawner";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
    @property(EnemySpawner) private enemySpawner: EnemySpawner;
    @property(XPSpawner) private xpSpawner: XPSpawner;

    private enemyMover: EnemyMover;

    public init(targetNode: Node): void {
        this.enemyMover = new EnemyMover(targetNode);

        this.enemySpawner.init(targetNode);
        this.enemySpawner.EnemyAddedEvent.on(this.onEnemyAdded, this);

        this.xpSpawner.init();
    }

    public gameTick(deltaTime: number): void {
        this.enemySpawner.gameTick(deltaTime);
        this.enemyMover.gameTick(deltaTime);
    }

    private onEnemyAdded(enemy: Enemy): void {
        enemy.DeathEvent.on(this.onEnemyDied, this);

        this.enemyMover.addEnemy(enemy);
    }

    private onEnemyDied(enemy: Enemy): void {
        enemy.DeathEvent.off(this.onEnemyDied);

        this.xpSpawner.spawnXp(enemy.node.worldPosition, 1);
        this.enemyMover.removeEnemy(enemy);
    }
}
