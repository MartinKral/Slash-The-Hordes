import { Node, Vec2 } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { WaveLauncherSettings } from "../../../Data/GameSettings";
import { IProjectileCollisionSignaler } from "../../../Projectile/IProjectileCollisionSignaler";
import { ProjectileCollision } from "../../../Projectile/ProjectileCollision";
import { ProjectileData, ProjectileLauncher } from "./ProjectileLauncher";

export class WaveProjectileLauncher implements IProjectileCollisionSignaler {
    private currentUpgrade = 0;
    private wavesToShootPerUpgrade = 0;

    public constructor(
        private launcher: ProjectileLauncher,
        playerNode: Node,
        directions: Vec2[],
        settings: WaveLauncherSettings,
        projectileData: ProjectileData
    ) {
        this.wavesToShootPerUpgrade = settings.wavesToShootPerUpgrade;
        launcher.init(playerNode, directions, settings.launcher, projectileData);
    }

    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.launcher.ProjectileCollisionEvent;
    }

    public gameTick(deltaTime: number): void {
        if (this.currentUpgrade == 0) return;

        this.launcher.gameTick(deltaTime);
    }

    public upgrade(): void {
        this.currentUpgrade++;
        this.launcher.WavesToShoot += this.wavesToShootPerUpgrade;
    }
}
