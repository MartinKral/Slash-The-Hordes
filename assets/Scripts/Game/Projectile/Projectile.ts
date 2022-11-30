import { CircleCollider2D, Collider2D, Component, Contact2DType, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ProjectileCollision } from "./ProjectileCollision";
const { ccclass, property } = _decorator;

@ccclass("Projectile")
export class Projectile extends Component {
    @property(CircleCollider2D) private collider: CircleCollider2D;
    private contactBeginEvent: Signal<ProjectileCollision> = new Signal<ProjectileCollision>();

    private isInit = false;
    public tryInit(): void {
        if (this.isInit) return;
        this.isInit = true;

        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onColliderContactBegin, this);
    }

    public get ContactBeginEvent(): ISignal<ProjectileCollision> {
        return this.contactBeginEvent;
    }

    private onColliderContactBegin(thisCollider: Collider2D, otherCollider: Collider2D): void {
        this.contactBeginEvent.trigger({ otherCollider, projectile: this });
    }
}
