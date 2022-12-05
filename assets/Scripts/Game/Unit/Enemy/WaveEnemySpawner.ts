import { GameTimer } from "../../../Services/GameTimer";
import { randomPositiveOrNegative } from "../../../Services/Utils/MathUtils";
import { EnemyMovementType } from "./EnemyMovementType";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyType } from "./EnemyType";

export class WaveEnemySpawner {
    private spawnTimer: GameTimer = new GameTimer(5);
    public constructor(private enemySpawner: EnemySpawner, private enemiesToSpawn: number, private enemyType: EnemyType) {}

    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);

        if (this.spawnTimer.tryFinishPeriod()) {
            const angle: number = (2 * Math.PI) / this.enemiesToSpawn;

            const defaultPosX: number = 200 * randomPositiveOrNegative();
            const defaultPosY: number = 200 * randomPositiveOrNegative();

            for (let i = 0; i < this.enemiesToSpawn; i++) {
                const posX: number = defaultPosX + 10 * i;
                const posY: number = defaultPosY + 10 * (i % 2);
                this.enemySpawner.spawnNewEnemy(posX, posY, EnemyMovementType.Launch);
            }
        }
    }
}
