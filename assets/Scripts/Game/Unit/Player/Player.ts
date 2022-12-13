import { BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { PlayerSettings } from "../../Data/GameSettings";
import { IInput } from "../../Input/IInput";
import { UnitHealth } from "../UnitHealth";
import { UnitLevel } from "../UnitLevel";
import { PlayerRegeneration } from "./PlayerRegeneration";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { Weapon } from "./Weapon/Weapon";

const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property private speed = 0;
    @property(BoxCollider2D) private collider: BoxCollider2D;
    @property(PlayerUI) private playerUI: PlayerUI;
    @property(Weapon) private weapon: Weapon;

    private input: IInput;
    private health: UnitHealth;
    private level: UnitLevel;
    private regeneration: PlayerRegeneration;

    public init(input: IInput, settings: PlayerData): void {
        this.input = input;
        this.health = new UnitHealth(settings.defaultHP);
        this.level = new UnitLevel(settings.requiredXP);
        this.regeneration = new PlayerRegeneration(this.health, settings.regenerationDelay);

        this.weapon.init(settings.weapon);

        this.playerUI.init(this.health);

        console.log("Bonus damage " + settings.bonusDamage);
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

    public get Regeneration(): PlayerRegeneration {
        return this.regeneration;
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
        this.regeneration.gameTick(deltaTime);
    }
}

export class PlayerData extends PlayerSettings {
    public bonusDamage = 0;
    public bonusHp = 0;
    public bonusSpeed = 0;
    public bonusXP = 0;
    public bonusGold = 0;
}
