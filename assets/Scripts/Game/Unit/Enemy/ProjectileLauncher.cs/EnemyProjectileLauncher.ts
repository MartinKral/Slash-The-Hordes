import { Vec3, Node, Vec2 } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { ProjectileLauncher } from "../../Player/ProjectileLauncher/ProjectileLauncher";
import { Enemy } from "../Enemy";
import { EnemyManager } from "../EnemyManager";

export class EnemyProjectileLauncher {
    private enemies: Enemy[] = [];
    private shootTimer: GameTimer = new GameTimer(3);

    public constructor(private playerNode: Node, private projectileLauncher: ProjectileLauncher, enemyManager: EnemyManager) {
        enemyManager.EnemyAddedEvent.on(this.tryAddEnemy, this);
        enemyManager.EnemyRemovedEvent.on(this.tryRemoveEnemy, this);
    }

    private tryAddEnemy(enemy: Enemy): void {
        if (enemy.Id == "BasicEnemy") {
            this.enemies.push();
        }
    }

    private tryRemoveEnemy(enemy: Enemy): void {
        if (enemy.Id == "BasicEnemy") {
            const index = this.enemies.indexOf(enemy);
            this.enemies.splice(index, 1);
        }
    }

    public gameTick(deltaTime: number): void {}
}
