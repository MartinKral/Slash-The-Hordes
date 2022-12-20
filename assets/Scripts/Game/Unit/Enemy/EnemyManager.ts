import { Component, Node, random, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { EnemyManagerSettings } from "../../Data/GameSettings";
import { GoldSpawner } from "../../Gold/GoldSpawner";
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
    @property(GoldSpawner) private goldSpawner: GoldSpawner;

    private movementTypeToMover: Map<EnemyMovementType, EnemyMover> = new Map<EnemyMovementType, EnemyMover>();

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
        this.movementTypeToMover.set(EnemyMovementType.PeriodicFollow, new PeriodicFollowTargetEnemyMover(targetNode, 5, 5));

        this.xpSpawner.init();
        this.goldSpawner.init();
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
        enemy.DeathEvent.on(this.onEnemyDied, this);
        this.getEnemyMover(enemy).addEnemy(enemy);
    }

    private onEnemyRemoved(enemy: Enemy): void {
        enemy.DeathEvent.off(this.onEnemyDied);
        this.getEnemyMover(enemy).removeEnemy(enemy);
    }

    private onEnemyDied(enemy: Enemy): void {
        for (let index = 0; index < enemy.XPReward; index++) {
            const position: Vec3 = enemy.node.worldPosition;
            position.x += randomRange(-10, 10);
            position.y += randomRange(-10, 10);
            this.xpSpawner.spawnXp(position, 1);
        }

        if (0 < enemy.GoldReward) {
            if (enemy.GoldReward < 1) {
                if (random() < enemy.GoldReward) {
                    this.goldSpawner.spawn(enemy.node.worldPosition);
                }
            } else {
                for (let i = 0; i < enemy.GoldReward; i++) {
                    const position: Vec3 = enemy.node.worldPosition;
                    position.x += randomRange(-10, 10);
                    position.y += randomRange(-10, 10);
                    this.goldSpawner.spawn(position);
                }
            }
        }
    }

    private getEnemyMover(enemy: Enemy): EnemyMover {
        if (this.movementTypeToMover.has(enemy.MovementType)) {
            return this.movementTypeToMover.get(enemy.MovementType);
        }

        throw new Error("Does not have mover of type " + enemy.MovementType);
    }
}
