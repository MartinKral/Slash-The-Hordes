import { BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { VirtualJoystic } from "../Input/VirtualJoystic";
import { Weapon } from "../Weapon";
import { UnitHealth } from "./UnitHealth";
import { PlayerUI } from "./PlayerUI/PlayerUI";
const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property private speed = 0;
    @property(BoxCollider2D) private collider: BoxCollider2D;
    @property(PlayerUI) private playerUI: PlayerUI;

    private virtualJoystic: VirtualJoystic;
    private weapon: Weapon;
    private health: UnitHealth;

    public init(virtualJoystic: VirtualJoystic, weapon: Weapon, maxHp: number): void {
        this.virtualJoystic = virtualJoystic;
        this.weapon = weapon;
        this.health = new UnitHealth(maxHp);

        this.weapon.node.parent = this.node;
        this.weapon.node.setPosition(new Vec3());

        this.playerUI.init(this.health);
    }

    public get Health(): UnitHealth {
        return this.health;
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
