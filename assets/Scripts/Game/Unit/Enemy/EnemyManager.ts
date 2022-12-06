import { Component, Node, _decorator } from "cc";
import { XPSpawner } from "../../XP/XPSpawner";
import { CircularEnemySpawner } from "./CircularEnemySpawner";
import { Enemy } from "./Enemy";
import { EnemyMovementType } from "./EnemyMovementType";
import { EnemyMover } from "./EnemyMover";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyType } from "./EnemyType";
import { FollowTargetEnemyMover } from "./FollowTargetEnemyMover";
import { InvididualEnemySpawner as IndividualEnemySpawner } from "./InvididualEnemySpawner";
import { LaunchToTargetEnemyMover } from "./LaunchToTargetEnemyMover";
import { WaveEnemySpawner } from "./WaveEnemySpawner";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
    @property(EnemySpawner) private enemySpawner: EnemySpawner;
    @property(XPSpawner) private xpSpawner: XPSpawner;

    private movementTypeToMover: Map<EnemyMovementType, EnemyMover> = new Map<EnemyMovementType, EnemyMover>();

    private individualEnemySpawner: IndividualEnemySpawner;
    private circularEnemySpawner: CircularEnemySpawner;
    private waveEnemySpawner: WaveEnemySpawner;

    public init(targetNode: Node): void {
        this.enemySpawner.init(targetNode);
        this.enemySpawner.EnemyAddedEvent.on(this.onEnemyAdded, this);
        this.enemySpawner.enemyRemovedEvent.on(this.onRemoveEnemy, this);

        this.individualEnemySpawner = new IndividualEnemySpawner(this.enemySpawner, EnemyType.Basic);
        this.circularEnemySpawner = new CircularEnemySpawner(this.enemySpawner, 30, EnemyType.Basic);
        this.waveEnemySpawner = new WaveEnemySpawner(this.enemySpawner, 30, 10, EnemyType.Basic);

        this.movementTypeToMover.set(EnemyMovementType.Follow, new FollowTargetEnemyMover(targetNode));
        this.movementTypeToMover.set(EnemyMovementType.Launch, new LaunchToTargetEnemyMover(targetNode));

        this.xpSpawner.init();
    }

    public gameTick(deltaTime: number): void {
        //this.individualEnemySpawner.gameTick(deltaTime);
        //this.circularEnemySpawner.gameTick(deltaTime);
        this.waveEnemySpawner.gameTick(deltaTime);

        for (const kvp of this.movementTypeToMover) {
            kvp[1].gameTick(deltaTime);
        }
    }

    private onEnemyAdded(enemy: Enemy): void {
        enemy.DeathEvent.on(this.onEnemyDied, this);
        this.getEnemyMover(enemy).addEnemy(enemy);
    }

    private onEnemyDied(enemy: Enemy): void {
        enemy.DeathEvent.off(this.onEnemyDied);
        this.xpSpawner.spawnXp(enemy.node.worldPosition, 1);
    }

    private onRemoveEnemy(enemy: Enemy): void {
        this.getEnemyMover(enemy).removeEnemy(enemy);
    }

    private getEnemyMover(enemy: Enemy): EnemyMover {
        if (this.movementTypeToMover.has(enemy.MovementType)) {
            return this.movementTypeToMover.get(enemy.MovementType);
        }

        throw new Error("Does not have mover of type " + enemy.MovementType);
    }
}
