import { Component, Prefab, Vec2, Vec3, _decorator, Node } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { ObjectPool } from "../../../../Services/ObjectPool";
import { roundToOneDecimal } from "../../../../Services/Utils/MathUtils";
import { HaloLauncherSettings } from "../../../Data/GameSettings";
import { PlayerProjectile } from "./PlayerProjectile";
const { ccclass, property } = _decorator;

@ccclass("HaloProjectileLauncher")
export class HaloProjectileLauncher extends Component {
    @property(Prefab) private projectilePrefab: Prefab;
    private fireTimer: GameTimer;
    private lifetimeTimer: GameTimer;
    private projectilesToSpawn: number;
    private defaultCooldown: number;
    private speed: number;
    private currentLevel = 0;

    private isFiring = false;

    private projectilePool: ObjectPool<PlayerProjectile>;
    private projectiles: PlayerProjectile[] = [];
    private directions: Vec2[] = [];

    private playerNode: Node;

    public init(playerNode: Node, settings: HaloLauncherSettings): void {
        this.playerNode = playerNode;
        this.projectilesToSpawn = settings.projectilesToSpawn;
        this.projectilePool = new ObjectPool<PlayerProjectile>(this.projectilePrefab, this.node, this.projectilesToSpawn, "PlayerProjectile");

        this.speed = settings.projectileSpeed;
        this.defaultCooldown = settings.cooldown;
        this.lifetimeTimer = new GameTimer(settings.projectileLifetime);
        this.fireTimer = new GameTimer(this.defaultCooldown);

        const angle: number = (2 * Math.PI) / this.projectilesToSpawn;

        for (let i = 0; i < this.projectilesToSpawn; i++) {
            const x: number = roundToOneDecimal(Math.sin(angle * i));
            const y: number = roundToOneDecimal(Math.cos(angle * i));
            this.directions.push(new Vec2(x, y).normalize());
        }
    }

    public upgrade(): void {
        this.currentLevel++;
        this.fireTimer = new GameTimer(this.defaultCooldown - this.currentLevel);
    }

    public gameTick(deltaTime: number): void {
        if (this.currentLevel == 0) return;

        this.fireTimer.gameTick(deltaTime);
        if (this.isFiring) {
            this.moveAllProjectiles(deltaTime);
            this.tryRemoveAllProjectiles(deltaTime);
        } else {
            if (this.fireTimer.tryFinishPeriod()) {
                this.fireProjectiles();
            }
        }
    }

    private fireProjectiles(): void {
        for (let index = 0; index < this.projectilesToSpawn; index++) {
            const projectile: PlayerProjectile = this.projectilePool.borrow();
            projectile.node.setWorldPosition(this.playerNode.worldPosition);
            projectile.node.active = true;
            this.projectiles.push(projectile);
        }

        this.isFiring = true;
    }

    private moveAllProjectiles(deltaTime: number): void {
        for (let i = 0; i < this.projectiles.length; i++) {
            const newPosition: Vec3 = this.projectiles[i].node.worldPosition;
            newPosition.x += this.directions[i].x * deltaTime * this.speed;
            newPosition.y += this.directions[i].y * deltaTime * this.speed;

            this.projectiles[i].node.setWorldPosition(newPosition);
        }
    }

    private tryRemoveAllProjectiles(deltaTime: number): void {
        this.lifetimeTimer.gameTick(deltaTime);
        if (this.lifetimeTimer.tryFinishPeriod()) {
            for (const projectile of this.projectiles) {
                this.projectilePool.return(projectile);
            }

            this.projectiles = [];
            this.isFiring = false;
        }
    }
}
