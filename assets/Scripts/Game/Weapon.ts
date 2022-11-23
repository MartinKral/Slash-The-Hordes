import { Animation, AnimationState, BoxCollider2D, Collider2D, Component, _decorator } from "cc";
import { GameTimer } from "../Services/GameTimer";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation;
    @property(BoxCollider2D) private collider: BoxCollider2D;

    private strikeTimer: GameTimer;
    private strikeState: AnimationState;

    public init(strikeDelay: number): void {
        this.strikeTimer = new GameTimer(strikeDelay);
        this.node.active = false;

        this.weaponAnimation.on(Animation.EventType.FINISHED, this.endStrike, this);
        this.strikeState = this.weaponAnimation.getState(this.weaponAnimation.clips[0].name);
        this.strikeState.speed = 1;
    }

    public gameTick(deltaTime: number): void {
        this.strikeTimer.gameTick(deltaTime);
        if (this.strikeTimer.tryFinishPeriod()) {
            this.strike();
        }
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    public get Damage(): number {
        return 5;
    }

    public upgradeWeaponDamage(): void {}
    public upgradeWeaponLength(): void {}

    private strike(): void {
        this.node.active = true;
        this.weaponAnimation.play(this.strikeState.name);
    }

    private endStrike(): void {
        this.node.active = false;
    }
}
