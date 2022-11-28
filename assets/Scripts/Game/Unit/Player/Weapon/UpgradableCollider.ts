import { BoxCollider2D, Collider2D, Component, Contact2DType, _decorator } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { Signal } from "../../../../Services/EventSystem/Signal";

const { ccclass, property } = _decorator;

@ccclass("UpgradableCollider")
export class UpgradableCollider extends Component {
    @property(BoxCollider2D) private colliders: BoxCollider2D[] = [];
    private contactBeginEvent: Signal<Collider2D> = new Signal<Collider2D>();
    private currentUpgradeLevel = 0;

    public init(): void {
        this.setUpgradeLevel();

        for (const collider of this.colliders) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onColliderContactBegin, this);
        }
    }

    public get ContactBeginEvent(): ISignal<Collider2D> {
        return this.contactBeginEvent;
    }

    public upgrade(): void {
        if (this.currentUpgradeLevel == this.colliders.length - 1) throw new Error("Already at max upgrade! " + this.currentUpgradeLevel);

        this.currentUpgradeLevel++;
        this.setUpgradeLevel();
    }

    private setUpgradeLevel(): void {
        for (const collider of this.colliders) {
            collider.node.active = false;
        }

        this.colliders[this.currentUpgradeLevel].node.active = true;
    }

    private onColliderContactBegin(thisCollider: Collider2D, otherCollider: Collider2D): void {
        this.contactBeginEvent.trigger(otherCollider);
    }
}
