import { BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { IInput } from "../../Input/IInput";
import { UnitHealth } from "../UnitHealth";
import { UnitLevel } from "../UnitLevel";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { Weapon } from "./Weapon/Weapon";

const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property private speed = 0;
    @property(BoxCollider2D) private collider: BoxCollider2D;
    @property(PlayerUI) private playerUI: PlayerUI;

    private input: IInput;
    private weapon: Weapon;
    private health: UnitHealth;
    private level: UnitLevel;

    public init(input: IInput, weapon: Weapon, maxHp: number, requiredLevelXps: number[]): void {
        this.input = input;
        this.weapon = weapon;
        this.health = new UnitHealth(maxHp);
        this.level = new UnitLevel(requiredLevelXps);

        this.weapon.node.parent = this.node;
        this.weapon.node.setPosition(new Vec3());

        this.playerUI.init(this.health);
    }

    public get Health(): UnitHealth {
        return this.health;
    }

    public get Level(): UnitLevel {
        return this.level;
    }

    public get Weapon(): Weapon {
        return this.weapon;
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    public gameTick(deltaTime: number): void {
        const movement: Vec2 = this.input.getAxis();
        movement.x *= deltaTime * this.speed;
        movement.y *= deltaTime * this.speed;

        const newPosition: Vec3 = this.node.worldPosition;
        newPosition.x += movement.x;
        newPosition.y += movement.y;

        this.node.setWorldPosition(newPosition);

        this.weapon.gameTick(deltaTime);
    }
}
