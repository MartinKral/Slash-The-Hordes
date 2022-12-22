import { ISignal } from "../../Services/EventSystem/ISignal";
import { ProjectileCollision } from "./ProjectileCollision";

export interface IProjectileLauncherSignaler {
    get ProjectileCollisionEvent(): ISignal<ProjectileCollision>;
    get ProjectileLaunchedEvent(): ISignal;
}
