import { _decorator, Component, Node, Prefab, Vec2, Vec3 } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { Signal } from "../../../../Services/EventSystem/Signal";
import { GameTimer } from "../../../../Services/GameTimer";
import { ObjectPool } from "../../../../Services/ObjectPool";
import { delay } from "../../../../Services/Utils/AsyncUtils";
import { getDegreeAngleFromDirection } from "../../../../Services/Utils/MathUtils";
import { ProjectileLauncherSettings } from "../../../Data/GameSettings";
import { IProjectileCollisionSignaler } from "../../../Projectile/IProjectileCollisionSignaler";
import { Projectile } from "../../../Projectile/Projectile";
import { ProjectileCollision } from "../../../Projectile/ProjectileCollision";
const { ccclass, property } = _decorator;

@ccclass("ProjectileLauncher")
export class ProjectileLauncher extends Component implements IProjectileCollisionSignaler {
    @property(Prefab) private projectilePrefab: Prefab;
    private projectileCollisionEvent: Signal<ProjectileCollision> = new Signal<ProjectileCollision>();
    private projectileData: ProjectileData;
    private projectilePool: ObjectPool<Projectile>;
    private fireTimer: GameTimer;
    private projectileLifetime: number;
    private speed: number;
    private wavesToShoot: number;
    private wavesDelayMs: number;
    private cooldown: number;

    private fireDirections: Vec2[];

    private projectiles: Projectile[] = [];
    private directions: Vec2[] = [];
    private expireTimes: number[] = [];
    private currentTime = 0;

    private playerNode: Node;

    public get WavesToShoot(): number {
        return this.wavesToShoot;
    }

    public set WavesToShoot(value: number) {
        this.wavesToShoot = value;
    }

    public get Cooldown(): number {
        return this.cooldown;
    }

    public set Cooldown(value: number) {
        this.cooldown = value;
        this.fireTimer = new GameTimer(this.cooldown);
    }

    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.projectileCollisionEvent;
    }

    public init(playerNode: Node, fireDirections: Vec2[], settings: ProjectileLauncherSettings, projectileData: ProjectileData): void {
        this.projectileData = projectileData;
        this.projectileLifetime = settings.projectileLifetime;
        this.speed = settings.projectileSpeed;
        this.wavesToShoot = settings.wavesToShoot;
        this.wavesDelayMs = settings.wavesDelayMs;
        this.cooldown = settings.cooldown;

        this.playerNode = playerNode;
        this.fireDirections = fireDirections;
        this.projectilePool = new ObjectPool<Projectile>(this.projectilePrefab, this.node, 6, "Projectile");
        this.fireTimer = new GameTimer(this.cooldown);
    }

    public gameTick(deltaTime: number): void {
        this.currentTime += deltaTime;
        this.fireTimer.gameTick(deltaTime);
        if (this.fireTimer.tryFinishPeriod()) {
            this.fireProjectiles();
        }

        this.tryRemoveExpiredProjectiles();
        this.moveAllProjectiles(deltaTime);
    }

    private async fireProjectiles(): Promise<void> {
        for (let i = 0; i < this.wavesToShoot; i++) {
            for (const direction of this.fireDirections) {
                this.fireProjectile(direction);
            }

            await delay(this.wavesDelayMs);
        }
    }

    private fireProjectile(direction: Vec2): void {
        const projectile: Projectile = this.projectilePool.borrow();
        projectile.init(this.projectileData.damage, this.projectileData.pierces, getDegreeAngleFromDirection(direction.x, direction.y));
        projectile.node.setWorldPosition(this.playerNode.worldPosition);
        projectile.node.active = true;
        projectile.ContactBeginEvent.on(this.onProjectileCollision, this);
        projectile.PiercesDepletedEvent.on(this.onPiercesDepleted, this);

        this.projectiles.push(projectile);
        this.directions.push(direction);
        this.expireTimes.push(this.currentTime + this.projectileLifetime);
    }

    private tryRemoveExpiredProjectiles(): void {
        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.currentTime < this.expireTimes[i]) break; // the oldest particles are at the start of the array

            const projectile: Projectile = this.projectiles[i];
            this.removeProjectile(projectile, i);
            i--; // Check the same index
        }
    }

    private onPiercesDepleted(projectile: Projectile): void {
        const index = this.projectiles.indexOf(projectile);
        if (index === -1) {
            throw new Error("Projectile not found!");
        }

        this.removeProjectile(projectile, index);
    }

    private removeProjectile(projectile: Projectile, index: number): void {
        projectile.ContactBeginEvent.off(this.onProjectileCollision);
        projectile.PiercesDepletedEvent.off(this.onPiercesDepleted);

        this.projectilePool.return(projectile);

        this.projectiles.splice(index, 1);
        this.directions.splice(index, 1);
        this.expireTimes.splice(index, 1);
    }

    private moveAllProjectiles(deltaTime: number): void {
        for (let i = 0; i < this.projectiles.length; i++) {
            const newPosition: Vec3 = this.projectiles[i].node.worldPosition;
            newPosition.x += this.directions[i].x * deltaTime * this.speed;
            newPosition.y += this.directions[i].y * deltaTime * this.speed;

            this.projectiles[i].node.setWorldPosition(newPosition);
        }
    }

    private onProjectileCollision(projectlieCollision: ProjectileCollision): void {
        this.projectileCollisionEvent.trigger(projectlieCollision);
    }
}

export class ProjectileData {
    public pierces = 0;
    public damage = 0;
}
