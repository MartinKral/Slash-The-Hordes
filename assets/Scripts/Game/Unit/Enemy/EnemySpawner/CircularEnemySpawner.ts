import { GameTimer } from "../../../../Services/GameTimer";
import { roundToOneDecimal } from "../../../../Services/Utils/MathUtils";
import { CircularEnemySpawnerSettings } from "../../../Data/GameSettings";

import { DelayedEnemySpawner } from "./DelayedEnemySpawner";
import { EnemySpawner } from "./EnemySpawner";

export class CircularEnemySpawner extends DelayedEnemySpawner {
    private spawnTimer: GameTimer;
    private enemyId: string;
    private enemiesToSpawn: number;

    public constructor(private enemySpawner: EnemySpawner, settings: CircularEnemySpawnerSettings) {
        super(settings.common.startDelay, settings.common.stopDelay);

        this.spawnTimer = new GameTimer(settings.common.cooldown);
        this.enemyId = settings.common.enemyId;
        this.enemiesToSpawn = settings.enemiesToSpawn;
    }

    public delayedGameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);

        if (this.spawnTimer.tryFinishPeriod()) {
            const angle: number = (2 * Math.PI) / this.enemiesToSpawn;

            for (let i = 0; i < this.enemiesToSpawn; i++) {
                const posX: number = roundToOneDecimal(Math.sin(angle * i)) * 600;
                const posY: number = roundToOneDecimal(Math.cos(angle * i)) * 600;
                this.enemySpawner.spawnNewEnemy(posX, posY, this.enemyId);
            }
        }
    }
}
