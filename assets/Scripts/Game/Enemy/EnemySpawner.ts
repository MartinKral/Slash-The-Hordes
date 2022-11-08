import { Component, Prefab, randomRange, Vec3, _decorator } from "cc";
import { GameTimer } from "../../Services/GameTimer";
import { ObjectPool } from "../../Services/ObjectPool";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass("EnemySpawner")
export class EnemySpawner extends Component {
    @property(Prefab) private enemies: Prefab[] = [];

    private enemyPool: ObjectPool<Enemy>;
    private spawnTimer: GameTimer;

    public init(): void {
        this.enemyPool = new ObjectPool(this.enemies[0], this.node, 5, Enemy);
        this.spawnTimer = new GameTimer(5);
    }

    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);
        if (this.spawnTimer.tryFinishPeriod()) {
            this.spawnNewEnemy();
        }
    }

    private spawnNewEnemy(): void {
        const enemy = this.enemyPool.borrow();
        enemy.node.active = true;
        enemy.node.setPosition(new Vec3(randomRange(-300, 300), randomRange(-300, 300)));

        enemy.setup();

        enemy.DeathEvent.on(this.returnEnemyToPool, this);
    }

    private returnEnemyToPool(enemy: Enemy): void {
        console.log("Return to enemy pool");
        enemy.DeathEvent.off(this.returnEnemyToPool);
        this.enemyPool.return(enemy);
    }
}
