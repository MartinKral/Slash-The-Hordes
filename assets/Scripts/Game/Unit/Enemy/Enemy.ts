import { BoxCollider2D, Component, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { UnitHealth } from "../UnitHealth";
import { EnemyMovementType } from "./EnemyMovementType";

const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
    @property(BoxCollider2D) public collider: BoxCollider2D;

    private movementType: EnemyMovementType;
    private health: UnitHealth = new UnitHealth(1);
    private deathEvent: Signal<Enemy> = new Signal<Enemy>();
    private speedX: number;
    private speedY: number;

    public setup(position: Vec3, movementType: EnemyMovementType): void {
        this.movementType = movementType;
        this.health = new UnitHealth(1);
        this.speedX = randomRange(40, 90);
        this.speedY = randomRange(40, 90);
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
        return 3;
    }

    public get Health(): UnitHealth {
        return this.health;
    }

    public get DeathEvent(): ISignal<Enemy> {
        return this.deathEvent;
    }

    public dealDamage(points: number): void {
        this.health.damage(points);
        if (!this.health.IsAlive) {
            this.deathEvent.trigger(this);
        }
    }

    public moveBy(move: Vec3, deltaTime: number): void {
        const newPosition: Vec3 = this.node.worldPosition;
        newPosition.x += move.x * this.speedX * deltaTime;
        newPosition.y += move.y * this.speedY * deltaTime;

        this.node.setWorldPosition(newPosition);
    }
}
