import { Component, Node, _decorator } from "cc";
import { XPSpawner } from "../../XP/XPSpawner";
import { CircularEnemySpawner } from "./CircularEnemySpawner";
import { Enemy } from "./Enemy";
import { EnemyMover } from "./EnemyMover";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyType } from "./EnemyType";
import { InvididualEnemySpawner as IndividualEnemySpawner } from "./InvididualEnemySpawner";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
    @property(EnemySpawner) private enemySpawner: EnemySpawner;
    @property(XPSpawner) private xpSpawner: XPSpawner;

    private enemyMover: EnemyMover;

    private individualEnemySpawner: IndividualEnemySpawner;
    private circularEnemySpawner: CircularEnemySpawner;

    public init(targetNode: Node): void {
        this.enemyMover = new EnemyMover(targetNode);

        this.enemySpawner.init(targetNode);
        this.enemySpawner.EnemyAddedEvent.on(this.onEnemyAdded, this);
        this.enemySpawner.enemyRemovedEvent.on(this.onRemoveEnemy, this);

        this.individualEnemySpawner = new IndividualEnemySpawner(this.enemySpawner, EnemyType.Basic);
        this.circularEnemySpawner = new CircularEnemySpawner(this.enemySpawner, 20, EnemyType.Basic);

        this.xpSpawner.init();
    }

    public gameTick(deltaTime: number): void {
        this.individualEnemySpawner.gameTick(deltaTime);
        this.circularEnemySpawner.gameTick(deltaTime);
        this.enemyMover.gameTick(deltaTime);
    }

    private onEnemyAdded(enemy: Enemy): void {
        enemy.DeathEvent.on(this.onEnemyDied, this);
        this.enemyMover.addEnemy(enemy);
    }

    private onEnemyDied(enemy: Enemy): void {
        enemy.DeathEvent.off(this.onEnemyDied);
        this.xpSpawner.spawnXp(enemy.node.worldPosition, 1);
    }

    private onRemoveEnemy(enemy: Enemy): void {
        this.enemyMover.removeEnemy(enemy);
    }
}
