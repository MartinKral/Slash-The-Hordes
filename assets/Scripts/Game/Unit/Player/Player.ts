import { Animation, Node, BoxCollider2D, Collider2D, Component, Vec2, Vec3, _decorator, Details, Sprite, Color } from "cc";
import { delay } from "../../../Services/Utils/AsyncUtils";
import { IInput } from "../../Input/IInput";
import { UnitHealth } from "../UnitHealth";
import { UnitLevel } from "../UnitLevel";
import { Magnet } from "./Magnet";
import { PlayerRegeneration } from "./PlayerRegeneration";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { Weapon } from "./Weapon/Weapon";

const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
    @property(BoxCollider2D) private collider: BoxCollider2D;
    @property(PlayerUI) private playerUI: PlayerUI;
    @property(Weapon) private weapon: Weapon;
    @property(Magnet) private magnet: Magnet;
    @property(Node) private playerGraphics: Node;
    @property(Animation) private animation: Animation;
    @property(Sprite) private sprite: Sprite;

    private input: IInput;
    private health: UnitHealth;
    private level: UnitLevel;
    private regeneration: PlayerRegeneration;
    private speed: number;

    private isMoveAnimationPlaying = false;

    public init(input: IInput, data: PlayerData): void {
        this.input = input;
        this.health = new UnitHealth(data.maxHp);
        this.level = new UnitLevel(data.requiredXP, data.xpMultiplier);
        this.regeneration = new PlayerRegeneration(this.health, data.regenerationDelay);
        this.speed = data.speed;

        this.weapon.init(data.strikeDelay, data.damage);
        this.magnet.init(data.magnetDuration);
        this.health.HealthPointsChangeEvent.on(this.animateHpChange, this);
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

    public get Magnet(): Magnet {
        return this.magnet;
    }

    public get Regeneration(): PlayerRegeneration {
        return this.regeneration;
    }

    public get Collider(): Collider2D {
        return this.collider;
    }

    public gameTick(deltaTime: number): void {
        this.move(deltaTime);
        this.weapon.gameTick(deltaTime);
        this.magnet.gameTick(deltaTime);
        this.regeneration.gameTick(deltaTime);
    }

    private move(deltaTime: number): void {
        if (!this.health.IsAlive) return;

        const movement: Vec2 = this.input.getAxis();
        if (!movement.equals(Vec2.ZERO)) {
            movement.x *= deltaTime * this.speed;
            movement.y *= deltaTime * this.speed;

            const newPosition: Vec3 = this.node.worldPosition;
            newPosition.x += movement.x;
            newPosition.y += movement.y;

            this.node.setWorldPosition(newPosition);

            if (!this.isMoveAnimationPlaying) {
                this.isMoveAnimationPlaying = true;
                this.animation.play("Move");
            }

            if (movement.x < 0) {
                this.playerGraphics.setScale(new Vec3(1, 1, 1));
            } else if (0 < movement.x) {
                this.playerGraphics.setScale(new Vec3(-1, 1, 1));
            }
        } else {
            if (this.isMoveAnimationPlaying) {
                this.isMoveAnimationPlaying = false;
                this.animation.play("Idle");
            }
        }
    }

    private async animateHpChange(hpChange: number): Promise<void> {
        if (hpChange < 0) {
            this.sprite.color = Color.RED;
        } else {
            this.sprite.color = Color.GREEN;
        }

        await delay(100);
        this.sprite.color = Color.WHITE;

        if (!this.health.IsAlive) {
            this.animation.play("Die");
        }
    }
}

export class PlayerData {
    public requiredXP: number[] = [];
    public speed = 0;
    public maxHp = 0;
    public regenerationDelay = 0;
    public xpMultiplier = 0;
    public goldMultiplier = 0;

    // Weapon
    public strikeDelay = 0;
    public damage = 0;

    // Magnet
    public magnetDuration = 0;
}
