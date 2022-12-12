import { randomRange } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { randomPositiveOrNegative } from "../../../../Services/Utils/MathUtils";
import { EnemyMovementType } from "../EnemyMovementType";
import { EnemyType } from "../EnemyType";
import { EnemySpawner } from "./EnemySpawner";

export class IndividualEnemySpawner {
    private spawnTimer: GameTimer = new GameTimer(1);

    public constructor(private enemySpawner: EnemySpawner, private movementType: EnemyMovementType, private enemyType: EnemyType) {}

    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);
        if (this.spawnTimer.tryFinishPeriod()) {
            const posX: number = randomRange(300, 600) * randomPositiveOrNegative();
            const posY: number = randomRange(300, 600) * randomPositiveOrNegative();
            this.enemySpawner.spawnNewEnemy(posX, posY, this.movementType);
        }
    }
}
