import { _decorator, Component, Prefab, Vec2, Vec3 } from "cc";
import { Empty } from "../../../Menu/ModalWindows/Upgrades/UpgradesModalWindow";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { ObjectPool } from "../../../Services/ObjectPool";
import { getDegreeAngleFromDirection } from "../../../Services/Utils/MathUtils";
import { IProjectileLauncherSignaler } from "../IProjectileLauncherSignaler";
import { Projectile } from "../Projectile";
import { ProjectileCollision } from "../ProjectileCollision";
const { ccclass, property } = _decorator;

@ccclass("ProjectileLauncher")
export class ProjectileLauncher extends Component implements IProjectileLauncherSignaler {
    @property(Prefab) private projectilePrefab: Prefab;
    private projectileCollisionEvent = new Signal<ProjectileCollision>();
    private projectileLaunchedEvent = new Signal();

    private projectileDamage: number;
    private projectilePierces: number;
    private projectileLifetime: number;
    private projectileSpeed: number;

    private projectilePool: ObjectPool<Projectile>;

    private projectiles: Projectile[] = [];
    private directions: Vec2[] = [];
    private expireTimes: number[] = [];
    private currentTime = 0;

    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.projectileCollisionEvent;
    }

    public get ProjectileLaunchedEvent(): ISignal {
        return this.projectileLaunchedEvent;
    }

    public init(projectileLifetime: number, projectileSpeed: number, projectileDamage: number, projectilePierces: number): void {
        this.projectileLifetime = projectileLifetime;
        this.projectileSpeed = projectileSpeed;
        this.projectileDamage = projectileDamage;
        this.projectilePierces = projectilePierces;

        this.projectilePool = new ObjectPool<Projectile>(this.projectilePrefab, this.node, 6, "Projectile");
    }

    public gameTick(deltaTime: number): void {
        this.currentTime += deltaTime;
        this.tryRemoveExpiredProjectiles();
        this.moveAllProjectiles(deltaTime);
    }

    public fireProjectiles(startPosition: Vec3, fireDirections: Vec2[]): void {
        for (const direction of fireDirections) {
            this.fireProjectile(startPosition, direction);
        }
    }

    private fireProjectile(startPosition: Vec3, direction: Vec2): void {
        direction = direction.normalize();
        const projectile: Projectile = this.projectilePool.borrow();
        projectile.setup(this.projectileDamage, this.projectilePierces, getDegreeAngleFromDirection(direction.x, direction.y));
        projectile.node.setWorldPosition(startPosition);
        projectile.node.active = true;
        projectile.ContactBeginEvent.on(this.onProjectileCollision, this);
        projectile.PiercesDepletedEvent.on(this.onPiercesDepleted, this);

        this.projectiles.push(projectile);
        this.directions.push(direction);
        this.expireTimes.push(this.currentTime + this.projectileLifetime);

        this.projectileLaunchedEvent.trigger();
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
            newPosition.x += this.directions[i].x * deltaTime * this.projectileSpeed;
            newPosition.y += this.directions[i].y * deltaTime * this.projectileSpeed;

            this.projectiles[i].node.setWorldPosition(newPosition);
        }
    }

    private onProjectileCollision(projectlieCollision: ProjectileCollision): void {
        this.projectileCollisionEvent.trigger(projectlieCollision);
    }
}
