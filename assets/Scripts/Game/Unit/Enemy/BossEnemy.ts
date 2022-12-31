import { Animation, Collider2D, Contact2DType, _decorator } from "cc";
import { GroupType } from "../../GroupType";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass("BossEnemy")
export class BossEnemy extends Enemy {
    @property(Collider2D) private bossCollider: Collider2D;
    @property(Animation) private animation: Animation;

    private isAnimatingAttack = false;

    public start(): void {
        this.bossCollider.on(Contact2DType.BEGIN_CONTACT, this.collisionBegin, this);
        this.bossCollider.on(Contact2DType.END_CONTACT, this.collisionEnd, this);
    }

    private collisionBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        if (otherCollider.group === GroupType.PLAYER) {
            this.animateAttack();
        }
    }

    private collisionEnd(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        if (otherCollider.group === GroupType.PLAYER) {
            this.animateMove();
        }
    }

    private animateAttack(): void {
        if (this.isAnimatingAttack) return;
        this.isAnimatingAttack = true;
        this.animation.play("Attack");
    }

    private animateMove(): void {
        if (!this.isAnimatingAttack) return;
        this.isAnimatingAttack = false;
        this.animation.play("Run");
    }
}
