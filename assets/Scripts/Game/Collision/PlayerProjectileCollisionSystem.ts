import { ProjectileCollision } from "../Projectile/ProjectileCollision";
import { Enemy } from "../Unit/Enemy/Enemy";
import { HaloProjectileLauncher } from "../Unit/Player/ProjectileLauncher/Halo/HaloProjectileLauncher";

export class PlayerProjectileCollisionSystem {
    public constructor(haloLauncher: HaloProjectileLauncher) {
        haloLauncher.ProjectileCollisionEvent.on(this.onProjectileCollision, this);
    }

    private onProjectileCollision(projectileCollision: ProjectileCollision): void {
        projectileCollision.otherCollider.getComponent(Enemy).dealDamage(1);
    }
}
