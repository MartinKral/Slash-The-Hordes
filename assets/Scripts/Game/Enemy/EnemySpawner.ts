import { Component, Prefab, randomRange, Vec3, _decorator } from "cc";
import { GameTimer } from "../../Services/GameTimer";
import { ObjectPool } from "../../Services/ObjectPool";
import { Enemy } from "./Enemy";
import { EnemyMover } from "./EnemyMover";
const { ccclass, property } = _decorator;

@ccclass("EnemySpawner")
export class EnemySpawner extends Component {
    @property(Prefab) private enemies: Prefab[] = [];

    private enemyPool: ObjectPool<Enemy>;
    private spawnTimer: GameTimer;
    private enemyMover: EnemyMover;

    public init(enemyMover: EnemyMover): void {
        this.enemyPool = new ObjectPool(this.enemies[0], this.node, 5, Enemy);
        this.spawnTimer = new GameTimer(1);
        this.enemyMover = enemyMover;
    }

    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);
        if (this.spawnTimer.tryFinishPeriod()) {
            this.spawnNewEnemy();
        }

        this.enemyMover.gameTick(deltaTime);
    }

    private spawnNewEnemy(): void {
        const enemy = this.enemyPool.borrow();
        enemy.node.active = true;
        enemy.node.setPosition(new Vec3(randomRange(-300, 300), randomRange(-300, 300)));

        enemy.setup();

        enemy.DeathEvent.on(this.returnEnemyToPool, this);

        this.enemyMover.addEnemy(enemy);
    }

    private returnEnemyToPool(enemy: Enemy): void {
        enemy.DeathEvent.off(this.returnEnemyToPool);
        this.enemyPool.return(enemy);

        this.enemyMover.removeEnemy(enemy);
    }
}
