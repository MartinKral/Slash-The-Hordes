import { randomRange } from "cc";
import { GameTimer } from "../../../Services/GameTimer";
import { randomPositiveOrNegative } from "../../../Services/Utils/MathUtils";
import { Enemy } from "./Enemy";
import { EnemyMovementType } from "./EnemyMovementType";
import { EnemySpawner } from "./EnemySpawner";
import { EnemyType } from "./EnemyType";

export class WaveEnemySpawner {
    private spawnTimer: GameTimer = new GameTimer(5);
    private waves: EnemyWave[] = [];
    public constructor(
        private enemySpawner: EnemySpawner,
        private enemiesToSpawn: number,
        private enemyLifeTime: number,
        private enemyType: EnemyType
    ) {}

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
                    this.enemySpawner.returnEnemy(enemy);
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
            const side: number = Math.ceil(Math.sqrt(this.enemiesToSpawn));
            for (let i = 0; i < this.enemiesToSpawn; i++) {
                const randomOffsetX: number = randomRange(-20, 20);
                const randomOffsetY: number = randomRange(-20, 20);
                const posX: number = defaultPosX + randomOffsetX + 50 * (i % side);
                const posY: number = defaultPosY + randomOffsetY + 50 * Math.floor(i / side);
                const enemy = this.enemySpawner.spawnNewEnemy(posX, posY, EnemyMovementType.Launch);
                enemies.push(enemy);
            }

            this.waves.push({ enemies, lifeTimeLeft: this.enemyLifeTime });
        }
    }
}

class EnemyWave {
    public enemies: Enemy[];
    public lifeTimeLeft: number;
}
