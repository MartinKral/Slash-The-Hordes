import { CircleCollider2D, Collider2D, Component, Contact2DType, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ProjectileCollision } from "./ProjectileCollision";
const { ccclass, property } = _decorator;

@ccclass("Projectile")
export class Projectile extends Component {
    @property(CircleCollider2D) private collider: CircleCollider2D;
    private contactBeginEvent = new Signal<ProjectileCollision>();
    private piercesDepletedEvent = new Signal<Projectile>();

    private isContactListenerSet = false;

    private piercesLeft = 0;
    private damage = 0;

    public init(damage: number, pierces: number): void {
        this.piercesLeft = pierces;
        this.damage = damage;

        if (!this.isContactListenerSet) {
            this.isContactListenerSet = true;
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onColliderContactBegin, this);
        }
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
