import { Component, Prefab, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { GameTimer } from "../../Services/GameTimer";
import { ObjectPool } from "../../Services/ObjectPool";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass("EnemySpawner")
export class EnemySpawner extends Component {
    @property(Prefab) private enemies: Prefab[] = [];

    public enemyAddedEvent: Signal<Enemy> = new Signal<Enemy>();

    private enemyPool: ObjectPool<Enemy>;
    private spawnTimer: GameTimer;

    public init(): void {
        this.enemyPool = new ObjectPool(this.enemies[0], this.node, 5, "Enemy");
        this.spawnTimer = new GameTimer(1);
    }

    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);
        if (this.spawnTimer.tryFinishPeriod()) {
            this.spawnNewEnemy();
        }
    }

    public get EnemyAddedEvent(): ISignal<Enemy> {
        return this.enemyAddedEvent;
    }

    private spawnNewEnemy(): void {
        const enemy = this.enemyPool.borrow();
        enemy.setup(new Vec3(randomRange(0, 300), randomRange(0, 800)));

        enemy.DeathEvent.on(this.returnEnemyToPool, this);

        this.enemyAddedEvent.trigger(enemy);
    }

    private returnEnemyToPool(enemy: Enemy): void {
        enemy.DeathEvent.off(this.returnEnemyToPool);
        this.enemyPool.return(enemy);
    }
}
