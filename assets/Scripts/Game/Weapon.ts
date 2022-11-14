import { Animation, BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { GameTimer } from "../Services/GameTimer";
import { delay } from "../Services/Utils/AsyncUtils";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation;
    @property(BoxCollider2D) private collider: BoxCollider2D;

    private strikeTimer: GameTimer;
    private lastDirection = new Vec2();

    public init(strikeDelay: number): void {
        this.strikeTimer = new GameTimer(strikeDelay);
        this.node.active = false;
    }

    public gameTick(deltaTime: number, movement: Vec2): void {
        let direction: Vec2 = movement.normalize();
        if (direction.x == 0 && direction.y == 0) {
            direction = this.lastDirection;
        } else {
            this.lastDirection = direction;
        }

        this.strikeTimer.gameTick(deltaTime);
        if (this.strikeTimer.tryFinishPeriod()) {
            this.strike(direction);
        }
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    public get Damage(): number {
        return 5;
    }

    private async strike(direction: Vec2): Promise<void> {
        this.node.active = true;

        const angle: number = (Math.atan2(direction.y, direction.x) * 180) / Math.PI - 45;
        this.node.eulerAngles = new Vec3(0, 0, angle);

        this.weaponAnimation.getState("WeaponSwing").speed = 4;
        this.weaponAnimation.play("WeaponSwing");

        await delay(1000);
        this.node.active = false;
    }
}
