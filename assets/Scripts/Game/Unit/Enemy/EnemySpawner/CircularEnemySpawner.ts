import { GameTimer } from "../../../../Services/GameTimer";
import { roundToOneDecimal } from "../../../../Services/Utils/MathUtils";

import { DelayedEnemySpawner } from "./DelayedEnemySpawner";
import { EnemySpawner } from "./EnemySpawner";

export class CircularEnemySpawner extends DelayedEnemySpawner {
    private spawnTimer: GameTimer = new GameTimer(10);

    public constructor(private enemySpawner: EnemySpawner, private enemiesToSpawn: number, private enemyId: string, startDelay = 0, stopDelay = 100) {
        super(startDelay, stopDelay);
    }

    public delayedGameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);

        if (this.spawnTimer.tryFinishPeriod()) {
            const angle: number = (2 * Math.PI) / this.enemiesToSpawn;

            for (let i = 0; i < this.enemiesToSpawn; i++) {
                const posX: number = roundToOneDecimal(Math.sin(angle * i)) * 500;
                const posY: number = roundToOneDecimal(Math.cos(angle * i)) * 500;
                this.enemySpawner.spawnNewEnemy(posX, posY, this.enemyId);
            }
        }
    }
}
