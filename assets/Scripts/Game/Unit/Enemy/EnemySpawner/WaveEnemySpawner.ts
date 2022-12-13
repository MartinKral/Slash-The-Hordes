import { randomRange } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { randomPositiveOrNegative } from "../../../../Services/Utils/MathUtils";
import { WaveEnemySpawnerSettings } from "../../../Data/GameSettings";
import { Enemy } from "../Enemy";
import { DelayedEnemySpawner } from "./DelayedEnemySpawner";
import { EnemySpawner } from "./EnemySpawner";

export class WaveEnemySpawner extends DelayedEnemySpawner {
    private enemiesPerWave: number;
    private enemyId: string;

    private spawnTimer: GameTimer;

    public constructor(private enemySpawner: EnemySpawner, settings: WaveEnemySpawnerSettings) {
        super(settings.common.startDelay, settings.common.stopDelay);

        this.spawnTimer = new GameTimer(settings.common.cooldown);
        this.enemiesPerWave = settings.enemiesToSpawn;
        this.enemyId = settings.common.enemyId;
    }

    public delayedGameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);
        if (this.spawnTimer.tryFinishPeriod()) {
            const defaultPosX: number = (500 + randomRange(0, 100)) * randomPositiveOrNegative();
            const defaultPosY: number = randomRange(0, 500) * randomPositiveOrNegative();

            const enemies: Enemy[] = [];
            const side: number = Math.ceil(Math.sqrt(this.enemiesPerWave));
            for (let i = 0; i < this.enemiesPerWave; i++) {
                const randomOffsetX: number = randomRange(-20, 20);
                const randomOffsetY: number = randomRange(-20, 20);
                const posX: number = defaultPosX + randomOffsetX + 50 * (i % side);
                const posY: number = defaultPosY + randomOffsetY + 50 * Math.floor(i / side);
                const enemy = this.enemySpawner.spawnNewEnemy(posX, posY, this.enemyId);
                enemies.push(enemy);
            }
        }
    }
}
