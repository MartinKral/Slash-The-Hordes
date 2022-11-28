import { BoxCollider2D, Component, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../../Services/EventSystem/ISignal";
import { Signal } from "../../../Services/EventSystem/Signal";
import { UnitHealth } from "../UnitHealth";

const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component implements IDamageDealing {
    @property(BoxCollider2D) public collider: BoxCollider2D;

    private health: UnitHealth = new UnitHealth(1);
    private deathEvent: Signal<Enemy> = new Signal<Enemy>();
    private speed: number;

    public setup(position: Vec3): void {
        this.health = new UnitHealth(1);
        this.speed = randomRange(0.5, 1);
        this.node.setWorldPosition(position);
        this.node.active = true;
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

    public moveBy(move: Vec3): void {
        const newPosition: Vec3 = this.node.worldPosition;
        newPosition.x += move.x * this.speed;
        newPosition.y += move.y * this.speed;

        this.node.setWorldPosition(newPosition);
    }
}

export interface IDamageDealing {
    Damage: number;
}
