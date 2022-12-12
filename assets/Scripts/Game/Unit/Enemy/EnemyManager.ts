import { Component, Node, _decorator } from "cc";
import { EnemyManagerSettings } from "../../Data/GameSettings";
import { XPSpawner } from "../../XP/XPSpawner";
import { Enemy } from "./Enemy";
import { EnemyMovementType } from "./EnemyMovementType";
import { EnemyMover } from "./EnemyMover/EnemyMover";
import { FollowTargetEnemyMover } from "./EnemyMover/FollowTargetEnemyMover";
import { PeriodicFollowTargetEnemyMover } from "./EnemyMover/PeriodicFollowTargetEnemyMover";
import { WaveEnemyMover } from "./EnemyMover/WaveEnemyMover";
import { CircularEnemySpawner } from "./EnemySpawner/CircularEnemySpawner";
import { DelayedEnemySpawner } from "./EnemySpawner/DelayedEnemySpawner";
import { EnemySpawner } from "./EnemySpawner/EnemySpawner";
import { IndividualEnemySpawner } from "./EnemySpawner/IndividualEnemySpawner";
import { WaveEnemySpawner } from "./EnemySpawner/WaveEnemySpawner";

const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
    @property(EnemySpawner) private enemySpawner: EnemySpawner;
    @property(XPSpawner) private xpSpawner: XPSpawner;

    private movementTypeToMover: Map<EnemyMovementType, EnemyMover> = new Map<EnemyMovementType, EnemyMover>();

    private spawners: DelayedEnemySpawner[] = [];

    public init(targetNode: Node, settings: EnemyManagerSettings): void {
        this.enemySpawner.init(targetNode, settings.enemies);
        this.enemySpawner.EnemyAddedEvent.on(this.onEnemyAdded, this);
        this.enemySpawner.enemyRemovedEvent.on(this.onRemoveEnemy, this);

        for (const individualSpawnerSettings of settings.individualEnemySpawners) {
            const individualSpawner = new IndividualEnemySpawner(this.enemySpawner, individualSpawnerSettings);
            this.spawners.push(individualSpawner);
        }

        for (const circularSpawnerSettings of settings.circularEnemySpawners) {
            const circularSpawner = new CircularEnemySpawner(this.enemySpawner, circularSpawnerSettings);
            this.spawners.push(circularSpawner);
        }

        for (const waveSpawnerSettings of settings.waveEnemySpawners) {
            const waveSpawner = new WaveEnemySpawner(this.enemySpawner, waveSpawnerSettings);
            this.spawners.push(waveSpawner);
        }

        this.movementTypeToMover.set(EnemyMovementType.Follow, new FollowTargetEnemyMover(targetNode));
        this.movementTypeToMover.set(EnemyMovementType.Launch, new WaveEnemyMover(targetNode));
        this.movementTypeToMover.set(EnemyMovementType.PeriodicFollow, new PeriodicFollowTargetEnemyMover(targetNode, 5, 5));

        this.xpSpawner.init();
    }

    public gameTick(deltaTime: number): void {
        for (const spawner of this.spawners) {
            spawner.gameTick(deltaTime);
        }

        for (const kvp of this.movementTypeToMover) {
            kvp[1].gameTick(deltaTime);
        }
    }

    private onEnemyDied(enemy: Enemy): void {
        enemy.DeathEvent.off(this.onEnemyDied);
        this.xpSpawner.spawnXp(enemy.node.worldPosition, 1);
    }

    private onEnemyAdded(enemy: Enemy): void {
        enemy.DeathEvent.on(this.onEnemyDied, this);
        this.getEnemyMover(enemy).addEnemy(enemy);
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
