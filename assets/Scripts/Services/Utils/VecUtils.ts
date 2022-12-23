import { Vec3 } from "cc";

export function getDirection(targetPosition: Vec3, sourcePosition: Vec3): Vec3 {
    const direction: Vec3 = new Vec3();
    return Vec3.subtract(direction, targetPosition, sourcePosition).normalize();
}
