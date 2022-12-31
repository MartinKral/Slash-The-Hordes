import { Animation, Vec3, _decorator } from "cc";
import { Enemy } from "./Enemy";
const { ccclass, property } = _decorator;

@ccclass("AnimatedEnemy")
export class AnimatedEnemy extends Enemy {
    @property(Animation) private animation: Animation;

    private isAnimatingIdle = false;

    public gameTick(move: Vec3, deltaTime: number): void {
        super.gameTick(move, deltaTime);

        console.log("Move x:  " + move.x + " Move y:  " + move.y);

        if (move.x === 0 && move.y === 0) {
            this.animateIdle();
        } else {
            this.animateRun();
        }
    }

    private animateIdle(): void {
        if (this.isAnimatingIdle) return;
        this.isAnimatingIdle = true;

        this.animation.play("Idle");
    }

    private animateRun(): void {
        if (!this.isAnimatingIdle) return;
        this.isAnimatingIdle = false;

        this.animation.play("Run");
    }
}
