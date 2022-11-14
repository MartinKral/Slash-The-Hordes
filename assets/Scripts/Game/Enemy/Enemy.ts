import { BoxCollider2D, Component, Vec2, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { UnitHealth } from "../Player/UnitHealth";
const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component implements IDamageDealing {
    @property(BoxCollider2D) public collider: BoxCollider2D;

    private health: UnitHealth = new UnitHealth(1);
    private deathEvent: Signal<Enemy> = new Signal<Enemy>();

    public setup(): void {
        this.node.active = true;
        this.health = new UnitHealth(1);
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
        newPosition.x += move.x;
        newPosition.y += move.y;

        this.node.setWorldPosition(newPosition);
    }
}

export interface IDamageDealing {
    Damage: number;
}
