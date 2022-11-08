import { Collider2D, IPhysics2DContact } from "cc";

export type ContactParams = {
    selfCollider: Collider2D;
    otherCollider: Collider2D;
    contact: IPhysics2DContact | null;
};
