import { Animation, BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { GameTimer } from "../Services/GameTimer";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation;
    @property(BoxCollider2D) private collider: BoxCollider2D;

    private strikeTimer: GameTimer;

    public init(strikeDelay: number): void {
        this.strikeTimer = new GameTimer(strikeDelay);
    }

    public gameTick(deltaTime: number, movement: Vec2): void {
        this.strikeTimer.gameTick(deltaTime);
        if (this.strikeTimer.tryFinishPeriod()) {
            this.strike(movement);
        }
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    public get Damage(): number {
        return 5;
    }

    private strike(movement: Vec2): void {
        const direction: Vec2 = movement.normalize();
        const angle: number = (Math.atan2(direction.y, direction.x) * 180) / Math.PI;
        this.node.eulerAngles = new Vec3(0, 0, angle);

        this.weaponAnimation.getState("WeaponSwing").speed = 4;
        this.weaponAnimation.play("WeaponSwing");
    }
}
