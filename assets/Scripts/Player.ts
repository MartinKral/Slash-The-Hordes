import { BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { VirtualJoystic } from "./VirtualJoystic";
import { Weapon } from "./Weapon";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property private speed = 0;
    @property(BoxCollider2D) private collider: BoxCollider2D;

    private virtualJoystic: VirtualJoystic;
    private weapon: Weapon;

    public init(virtualJoystic: VirtualJoystic, weapon: Weapon): void {
        this.virtualJoystic = virtualJoystic;
        this.weapon = weapon;

        this.weapon.node.parent = this.node;
        this.weapon.node.setPosition(new Vec3());
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    public gameTick(deltaTime: number): void {
        const movement: Vec2 = this.virtualJoystic.getAxis();
        movement.x *= deltaTime * this.speed;
        movement.y *= deltaTime * this.speed;

        const newPosition: Vec3 = this.node.worldPosition;
        newPosition.x += movement.x;
        newPosition.y += movement.y;

        this.node.setWorldPosition(newPosition);

        this.weapon.gameTick(deltaTime, movement);
    }
}
