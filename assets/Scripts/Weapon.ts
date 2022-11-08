import { Animation, BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation;
    @property(BoxCollider2D) private collider: BoxCollider2D;

    private strikeDelay: number;
    private currentDelay = 0;

    public init(strikeDelay: number): void {
        this.strikeDelay = strikeDelay;
    }

    public gameTick(deltaTime: number, movement: Vec2): void {
        this.currentDelay += deltaTime;
        if (this.strikeDelay / 4 <= this.currentDelay) {
            this.currentDelay = 0;
            this.strike(movement);
        }
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    private strike(movement: Vec2): void {
        const direction: Vec2 = movement.normalize();
        const angle: number = (Math.atan2(direction.y, direction.x) * 180) / Math.PI;
        this.node.eulerAngles = new Vec3(0, 0, angle);

        this.weaponAnimation.getState("WeaponSwing").speed = 4;
        this.weaponAnimation.play("WeaponSwing");
    }
}
