import { randomRange } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { randomPositiveOrNegative } from "../../../../Services/Utils/MathUtils";
import { WaveEnemySpawnerSettings } from "../../../Data/GameSettings";
import { Enemy } from "../Enemy";
import { EnemyMovementType } from "../EnemyMovementType";
import { EnemySpawner } from "../EnemySpawner";
import { EnemyType } from "../EnemyType";

export class WaveEnemySpawner {
    private enemiesPerWave: number;
    private waveLifetime: number;
    private enemyType: EnemyType;

    private spawnTimer: GameTimer;
    private waves: EnemyWave[] = [];

    public constructor(private enemySpawner: EnemySpawner, settings: WaveEnemySpawnerSettings) {
        this.spawnTimer = new GameTimer(settings.cooldown);
        this.enemiesPerWave = settings.enemiesPerWave;
        this.waveLifetime = settings.waveLifetime;
        this.enemyType = <EnemyType>settings.enemyType;
    }

    public gameTick(deltaTime: number): void {
        this.spawnTimer.gameTick(deltaTime);

        this.tryRemoveExpiredEnemies(deltaTime);
        this.trySpawnNewGroup();
    }

    private tryRemoveExpiredEnemies(deltaTime: number): void {
        for (let i = this.waves.length - 1; 0 <= i; i--) {
            const wave: EnemyWave = this.waves[i];
            wave.lifeTimeLeft -= deltaTime;

            if (wave.lifeTimeLeft <= 0) {
                for (const enemy of wave.enemies) {
                    if (enemy.Health.IsAlive) {
                        this.enemySpawner.returnEnemy(enemy);
                    }
                }

                this.waves.splice(i, 1);
            }
        }
    }

    private trySpawnNewGroup(): void {
        if (this.spawnTimer.tryFinishPeriod()) {
            const defaultPosX: number = 200 * randomPositiveOrNegative();
            const defaultPosY: number = 200 * randomPositiveOrNegative();

            const enemies: Enemy[] = [];
            const side: number = Math.ceil(Math.sqrt(this.enemiesPerWave));
            for (let i = 0; i < this.enemiesPerWave; i++) {
                const randomOffsetX: number = randomRange(-20, 20);
                const randomOffsetY: number = randomRange(-20, 20);
                const posX: number = defaultPosX + randomOffsetX + 50 * (i % side);
                const posY: number = defaultPosY + randomOffsetY + 50 * Math.floor(i / side);
                const enemy = this.enemySpawner.spawnNewEnemy(posX, posY, EnemyMovementType.Launch);
                enemies.push(enemy);
            }

            this.waves.push({ enemies, lifeTimeLeft: this.waveLifetime });
        }
    }
}

class EnemyWave {
    public enemies: Enemy[];
    public lifeTimeLeft: number;
}
