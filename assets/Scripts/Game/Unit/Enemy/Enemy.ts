import { BoxCollider2D, Component, randomRange, Vec3, _decorator } from "cc";
import { time } from "console";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { EnemySettings } from "../../Data/GameSettings";
import { UnitHealth } from "../UnitHealth";
import { EnemyMovementType } from "./EnemyMovementType";

const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
    @property(BoxCollider2D) public collider: BoxCollider2D;

    private deathEvent: Signal<Enemy> = new Signal<Enemy>();
    private lifetimeEndedEvent: Signal<Enemy> = new Signal<Enemy>();

    private movementType: EnemyMovementType;
    private health: UnitHealth;
    private damage: number;
    private speedX: number;
    private speedY: number;
    private lifetimeLeft: number;

    private xpReward: number;
    private goldReward: number;

    public setup(position: Vec3, settings: EnemySettings): void {
        this.movementType = <EnemyMovementType>settings.moveType;
        this.health = new UnitHealth(settings.health);
        this.damage = settings.damage;
        this.speedX = randomRange(settings.speed / 2, settings.speed);
        this.speedY = randomRange(settings.speed / 2, settings.speed);
        this.lifetimeLeft = settings.lifetime;

        this.xpReward = settings.xpReward;
        this.goldReward = settings.goldReward;

        this.node.setWorldPosition(position);
        this.node.active = true;
    }

    public get MovementType(): EnemyMovementType {
        return this.movementType;
    }

    public get Collider(): BoxCollider2D {
        return this.collider;
    }

    public get Damage(): number {
        return this.damage;
    }

    public get Health(): UnitHealth {
        return this.health;
    }

    public get DeathEvent(): ISignal<Enemy> {
        return this.deathEvent;
    }

    public get LifetimeEndedEvent(): ISignal<Enemy> {
        return this.lifetimeEndedEvent;
    }

    public dealDamage(points: number): void {
        this.health.damage(points);
        if (!this.health.IsAlive) {
            this.deathEvent.trigger(this);
        }
    }

    public gameTick(move: Vec3, deltaTime: number): void {
        const newPosition: Vec3 = this.node.worldPosition;
        newPosition.x += move.x * this.speedX * deltaTime;
        newPosition.y += move.y * this.speedY * deltaTime;

        this.node.setWorldPosition(newPosition);

        if (0 < this.lifetimeLeft) {
            this.lifetimeLeft -= deltaTime;
            if (this.lifetimeLeft <= 0) {
                this.lifetimeEndedEvent.trigger(this);
            }
        }
    }
}
