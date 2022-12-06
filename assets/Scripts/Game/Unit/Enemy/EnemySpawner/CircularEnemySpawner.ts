import { GameTimer } from "../../../../Services/GameTimer";
import { roundToOneDecimal } from "../../../../Services/Utils/MathUtils";
import { EnemyMovementType } from "../EnemyMovementType";
import { EnemySpawner } from "../EnemySpawner";
import { EnemyType } from "../EnemyType";

export class CircularEnemySpawner {
    private spawnTimer: GameTimer = new GameTimer(10);
    public constructor(private enemySpawner: EnemySpawner, private enemiesToSpawn: number, private enemyType: EnemyType) {}
    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);

        if (this.spawnTimer.tryFinishPeriod()) {
            const angle: number = (2 * Math.PI) / this.enemiesToSpawn;

            for (let i = 0; i < this.enemiesToSpawn; i++) {
                const posX: number = roundToOneDecimal(Math.sin(angle * i)) * 500;
                const posY: number = roundToOneDecimal(Math.cos(angle * i)) * 500;
                this.enemySpawner.spawnNewEnemy(posX, posY, EnemyMovementType.Follow);
            }
        }
    }
}
