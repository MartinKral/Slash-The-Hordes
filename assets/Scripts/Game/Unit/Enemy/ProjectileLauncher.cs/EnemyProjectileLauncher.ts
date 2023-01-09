import { Vec3, Node, Vec2 } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { EnemyLauncherSettings } from "../../../Data/GameSettings";
import { ProjectileLauncher } from "../../../Projectile/ProjectileLauncher/ProjectileLauncher";
import { Enemy } from "../Enemy";
import { EnemyManager } from "../EnemyManager";

export class EnemyProjectileLauncher {
    private enemyToTimer = new Map<Enemy, GameTimer>();
    private cooldown: number;
    private enemyIds: string[];

    public constructor(
        private projectileLauncher: ProjectileLauncher,
        private playerNode: Node,
        enemyManager: EnemyManager,
        settings: EnemyLauncherSettings
    ) {
        enemyManager.EnemyAddedEvent.on(this.tryAddEnemy, this);
        enemyManager.EnemyRemovedEvent.on(this.tryRemoveEnemy, this);

        this.cooldown = settings.cooldown;
        this.enemyIds = settings.enemyIds;
        projectileLauncher.init(settings.projectileLifetime, settings.projectileSpeed, settings.projectileDamage, 1);
    }

    private tryAddEnemy(enemy: Enemy): void {
        if (this.enemyIds.includes(enemy.Id)) {
            this.enemyToTimer.set(enemy, new GameTimer(this.cooldown));
        }
    }

    private tryRemoveEnemy(enemy: Enemy): void {
        if (!this.enemyToTimer.has(enemy)) return;

        this.enemyToTimer.delete(enemy);
    }

    public gameTick(deltaTime: number): void {
        this.projectileLauncher.gameTick(deltaTime);

        for (const enemyAndTimerPair of this.enemyToTimer) {
            const enemyWorldPosition: Vec3 = enemyAndTimerPair[0].node.worldPosition;
            const shootTimer: GameTimer = enemyAndTimerPair[1];

            shootTimer.gameTick(deltaTime);
            if (shootTimer.tryFinishPeriod()) {
                let direction: Vec3 = new Vec3();
                direction = Vec3.subtract(direction, this.playerNode.worldPosition, enemyWorldPosition);
                this.projectileLauncher.fireProjectiles(enemyWorldPosition, [new Vec2(direction.x, direction.y)]);
            }
        }
    }
}
