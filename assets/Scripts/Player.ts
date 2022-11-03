import { Component, Vec2, Vec3, _decorator } from "cc";
import { VirtualJoystic } from "./VirtualJoystic";
import { Weapon } from "./Weapon";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    private virtualJoystic: VirtualJoystic;
    @property private speed = 0;

    @property(Weapon) private weapon: Weapon;

    public init(virtualJoystic: VirtualJoystic, strikeDelay: number): void {
        this.virtualJoystic = virtualJoystic;
        this.weapon.init(strikeDelay);
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
