import { Animation, BoxCollider2D, Component, Contact2DType, Vec2, Vec3, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation;
    @property(BoxCollider2D) private weaponCollider: BoxCollider2D;

    private strikeDelay: number;
    private currentDelay = 0;

    public init(strikeDelay: number): void {
        this.strikeDelay = strikeDelay;

        this.weaponCollider.on(Contact2DType.BEGIN_CONTACT, () => {
            console.log("Begin Contact!");
        });
    }

    public gameTick(deltaTime: number, movement: Vec2): void {
        this.currentDelay += deltaTime;
        if (this.strikeDelay <= this.currentDelay) {
            this.currentDelay = 0;
            this.strike(movement);
        }
    }

    private strike(movement: Vec2): void {
        const direction: Vec2 = movement.normalize();
        const angle: number = (Math.atan2(direction.y, direction.x) * 180) / Math.PI;
        this.node.eulerAngles = new Vec3(0, 0, angle);

        this.weaponAnimation.play("WeaponSwing");
    }
}
