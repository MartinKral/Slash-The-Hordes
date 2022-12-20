import { Component, Node, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { EnemyManagerSettings } from "../../Data/GameSettings";
import { Enemy } from "./Enemy";
import { EnemyMovementType } from "./EnemyMovementType";
import { IEnemyMover } from "./EnemyMover/EnemyMover";
import { FollowTargetEnemyMover } from "./EnemyMover/FollowTargetEnemyMover";
import { PeriodicFollowMovers } from "./EnemyMover/PeriodicFollow/PeriodicFollowMovers";
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

    private movementTypeToMover: Map<EnemyMovementType, IEnemyMover> = new Map<EnemyMovementType, IEnemyMover>();

    private spawners: DelayedEnemySpawner[] = [];

    public init(targetNode: Node, settings: EnemyManagerSettings): void {
        this.enemySpawner.init(targetNode, settings.enemies);
        this.enemySpawner.EnemyAddedEvent.on(this.onEnemyAdded, this);
        this.enemySpawner.EnemyRemovedEvent.on(this.onEnemyRemoved, this);

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
        this.movementTypeToMover.set(EnemyMovementType.PeriodicFollow, new PeriodicFollowMovers(targetNode, settings.periodicFollowMovers));
    }

    public gameTick(deltaTime: number): void {
        for (const spawner of this.spawners) {
            spawner.gameTick(deltaTime);
        }

        for (const kvp of this.movementTypeToMover) {
            kvp[1].gameTick(deltaTime);
        }
    }

    public get EnemyAddedEvent(): ISignal<Enemy> {
        return this.enemySpawner.EnemyAddedEvent;
    }

    public get EnemyRemovedEvent(): ISignal<Enemy> {
        return this.enemySpawner.EnemyRemovedEvent;
    }

    private onEnemyAdded(enemy: Enemy): void {
        this.getEnemyMover(enemy).addEnemy(enemy);
    }

    private onEnemyRemoved(enemy: Enemy): void {
        this.getEnemyMover(enemy).removeEnemy(enemy);
    }

    private getEnemyMover(enemy: Enemy): IEnemyMover {
        if (this.movementTypeToMover.has(enemy.MovementType)) {
            return this.movementTypeToMover.get(enemy.MovementType);
        }

        throw new Error("Does not have mover of type " + enemy.MovementType);
    }
}
