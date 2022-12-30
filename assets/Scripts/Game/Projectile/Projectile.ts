import { Collider2D, Component, Contact2DType, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ProjectileCollision } from "./ProjectileCollision";
const { ccclass, property } = _decorator;

@ccclass("Projectile")
export class Projectile extends Component {
    @property(Collider2D) private collider: Collider2D;
    private contactBeginEvent = new Signal<ProjectileCollision>();
    private piercesDepletedEvent = new Signal<Projectile>();

    private isContactListenerSet = false;

    private piercesLeft = 0;
    private damage = 0;

    public setup(damage: number, pierces: number, angle: number): void {
        this.piercesLeft = pierces;
        this.damage = damage;

        if (!this.isContactListenerSet) {
            this.isContactListenerSet = true;
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onColliderContactBegin, this);
        }

        this.node.setRotationFromEuler(new Vec3(0, 0, angle));
    }

    public pierce(): void {
        this.piercesLeft--;
        if (this.piercesLeft <= 0) {
            this.piercesDepletedEvent.trigger(this);
        }
    }

    public get Damage(): number {
        return this.damage;
    }

    public get ContactBeginEvent(): ISignal<ProjectileCollision> {
        return this.contactBeginEvent;
    }

    public get PiercesDepletedEvent(): ISignal<Projectile> {
        return this.piercesDepletedEvent;
    }

    private onColliderContactBegin(thisCollider: Collider2D, otherCollider: Collider2D): void {
        this.contactBeginEvent.trigger({ otherCollider, projectile: this });
    }
}
