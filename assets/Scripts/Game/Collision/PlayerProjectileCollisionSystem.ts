import { IProjectileLauncherSignaler } from "../Projectile/IProjectileLauncherSignaler";
import { ProjectileCollision } from "../Projectile/ProjectileCollision";
import { Enemy } from "../Unit/Enemy/Enemy";

export class PlayerProjectileCollisionSystem {
    public constructor(collisionSignalers: IProjectileLauncherSignaler[]) {
        for (const collisionSignaler of collisionSignalers) {
            collisionSignaler.ProjectileCollisionEvent.on(this.onProjectileCollision, this);
        }
    }

    private onProjectileCollision(projectileCollision: ProjectileCollision): void {
        projectileCollision.otherCollider.getComponent(Enemy).dealDamage(projectileCollision.projectile.Damage);
        projectileCollision.projectile.pierce();
    }
}
