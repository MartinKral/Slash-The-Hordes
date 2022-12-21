import { Vec2, Node } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { roundToOneDecimal } from "../../../../Services/Utils/MathUtils";
import { HaloLauncherSettings } from "../../../Data/GameSettings";
import { ProjectileCollision } from "../../../Projectile/ProjectileCollision";
import { IProjectileCollisionSignaler } from "../../../Projectile/IProjectileCollisionSignaler";
import { ProjectileLauncher } from "./ProjectileLauncher";
import { ProjectileData } from "./ProjectileData";
import { GameTimer } from "../../../../Services/GameTimer";

export class HaloProjectileLauncher implements IProjectileCollisionSignaler {
    private currentUpgrade = 0;
    private defaultCooldown = 0;
    private cooldownDivisorPerUpgrade = 0;
    private directions: Vec2[] = [];
    private fireTimer = new GameTimer(0);

    public constructor(
        private launcher: ProjectileLauncher,
        private playerNode: Node,
        settings: HaloLauncherSettings,
        projectileData: ProjectileData
    ) {
        this.defaultCooldown = settings.launcher.cooldown;
        this.cooldownDivisorPerUpgrade = settings.cooldownDivisorPerUpgrade;

        const angle: number = (2 * Math.PI) / settings.projectilesToSpawn;

        for (let i = 0; i < settings.projectilesToSpawn; i++) {
            const x: number = roundToOneDecimal(Math.sin(angle * i));
            const y: number = roundToOneDecimal(Math.cos(angle * i));
            this.directions.push(new Vec2(x, y).normalize());
        }

        launcher.init(settings.launcher.projectileLifetime, settings.launcher.projectileSpeed, projectileData.damage, projectileData.pierces);
    }

    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.launcher.ProjectileCollisionEvent;
    }

    public gameTick(deltaTime: number): void {
        if (this.currentUpgrade == 0) return;

        this.launcher.gameTick(deltaTime);
        this.fireTimer.gameTick(deltaTime);

        if (this.fireTimer.tryFinishPeriod()) {
            this.launcher.fireProjectiles(this.playerNode.worldPosition, this.directions);
        }
    }

    public upgrade(): void {
        this.currentUpgrade++;
        this.fireTimer = new GameTimer(this.defaultCooldown / (this.cooldownDivisorPerUpgrade * this.currentUpgrade));
    }
}
