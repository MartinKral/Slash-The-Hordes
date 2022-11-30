import { ISignal } from "../../Services/EventSystem/ISignal";
import { ProjectileCollision } from "./ProjectileCollision";

export interface IProjectileCollisionSignaler {
    get ProjectileCollisionEvent(): ISignal<ProjectileCollision>;
}
