import { Component, Node, Prefab, Vec2, Vec3, _decorator } from "cc";
import { ISignal } from "../../../../../Services/EventSystem/ISignal";
import { Signal } from "../../../../../Services/EventSystem/Signal";
import { GameTimer } from "../../../../../Services/GameTimer";
import { ObjectPool } from "../../../../../Services/ObjectPool";
import { roundToOneDecimal } from "../../../../../Services/Utils/MathUtils";
import { HaloLauncherSettings } from "../../../../Data/GameSettings";
import { Projectile } from "../../../../Projectile/Projectile";
import { ProjectileCollision } from "../../../../Projectile/ProjectileCollision";

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

    private projectilePool: ObjectPool<Projectile>;
    private projectiles: Projectile[] = [];
    private directions: Vec2[] = [];

    private playerNode: Node;

    private projectileCollisionEvent: Signal<ProjectileCollision> = new Signal<ProjectileCollision>();

    public init(playerNode: Node, settings: HaloLauncherSettings): void {
        this.playerNode = playerNode;
        this.projectilesToSpawn = settings.projectilesToSpawn;
        this.projectilePool = new ObjectPool<Projectile>(this.projectilePrefab, this.node, this.projectilesToSpawn, "PlayerProjectile");

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

    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.projectileCollisionEvent;
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
            const projectile: Projectile = this.projectilePool.borrow();
            projectile.tryInit();
            projectile.node.setWorldPosition(this.playerNode.worldPosition);
            projectile.node.active = true;
            projectile.ContactBeginEvent.on(this.onProjectileCollision, this);
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
                projectile.ContactBeginEvent.off(this.onProjectileCollision);
                this.projectilePool.return(projectile);
            }

            this.projectiles = [];
            this.isFiring = false;
        }
    }

    private onProjectileCollision(projectileCollision: ProjectileCollision): void {
        this.projectileCollisionEvent.trigger(projectileCollision);
    }
}
