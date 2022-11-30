import { _decorator, Component, Node, Prefab, Vec2, Vec3 } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { ObjectPool } from "../../../../Services/ObjectPool";
import { delay } from "../../../../Services/Utils/AsyncUtils";
import { Projectile } from "../../../Projectile/Projectile";
const { ccclass, property } = _decorator;

@ccclass("ProjectileLauncher")
export class ProjectileLauncher extends Component {
    @property(Prefab) private projectilePrefab: Prefab;
    private projectilePool: ObjectPool<Projectile>;
    private fireTimer: GameTimer;
    private projectileLifetime = 5;
    private speed = 300;

    private fireDirections: Vec2[];

    private projectiles: Projectile[] = [];
    private directions: Vec2[] = [];
    private expireTimes: number[] = [];
    private currentTime = 0;

    private currentUpgrade = 0;

    private playerNode: Node;

    public init(playerNode: Node, fireDirections: Vec2[]): void {
        this.playerNode = playerNode;
        this.fireDirections = fireDirections;
        this.projectilePool = new ObjectPool<Projectile>(this.projectilePrefab, this.node, 6, "Projectile");
        this.fireTimer = new GameTimer(2);
    }

    public gameTick(deltaTime: number): void {
        if (this.currentUpgrade == 0) return;

        this.currentTime += deltaTime;
        this.fireTimer.gameTick(deltaTime);
        if (this.fireTimer.tryFinishPeriod()) {
            this.fireProjectiles();
        }

        this.tryRemoveExpiredProjectiles();
        this.moveAllProjectiles(deltaTime);
    }

    public upgrade(): void {
        this.currentUpgrade++;
    }

    private async fireProjectiles(): Promise<void> {
        for (let i = 0; i < this.currentUpgrade; i++) {
            await delay(100);
            for (const direction of this.fireDirections) {
                this.fireProjectile(direction);
            }
        }
    }

    private fireProjectile(direction: Vec2): void {
        const projectile: Projectile = this.projectilePool.borrow();
        projectile.tryInit();
        projectile.node.setWorldPosition(this.playerNode.worldPosition);
        projectile.node.active = true;

        this.projectiles.push(projectile);
        this.directions.push(direction);
        this.expireTimes.push(this.currentTime + this.projectileLifetime);
    }

    private tryRemoveExpiredProjectiles(): void {
        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.currentTime < this.expireTimes[i]) break; // the oldest particles are at the start of the array

            this.projectilePool.return(this.projectiles[i]);
            this.projectiles.splice(i, 1);
            this.directions.splice(i, 1);
            this.expireTimes.splice(i, 1);
            i--; // Check the same index
        }
    }

    private moveAllProjectiles(deltaTime: number): void {
        for (let i = 0; i < this.projectiles.length; i++) {
            const newPosition: Vec3 = this.projectiles[i].node.worldPosition;
            newPosition.x += this.directions[i].x * deltaTime * this.speed;
            newPosition.y += this.directions[i].y * deltaTime * this.speed;

            this.projectiles[i].node.setWorldPosition(newPosition);
        }
    }
}
