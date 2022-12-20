import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";

export class UnitHealth {
    private healthPoints: number;
    private maxHealthPoints: number;
    private healthPointsChangeEvent: Signal<number> = new Signal<number>();

    public constructor(maxHealth: number) {
        this.maxHealthPoints = maxHealth;
        this.healthPoints = maxHealth;
    }

    public get IsAlive(): boolean {
        return 0 < this.healthPoints;
    }

    public get HealthPoints(): number {
        return this.healthPoints;
    }
    public get MaxHealthPoints(): number {
        return this.maxHealthPoints;
    }

    public get HealthPointsChangeEvent(): ISignal<number> {
        return this.healthPointsChangeEvent;
    }

    public heal(points: number): void {
        this.healthPoints = Math.min(this.maxHealthPoints, this.healthPoints + points);
        this.healthPointsChangeEvent.trigger(points);
    }

    public damage(points: number): void {
        this.healthPoints -= points;
        this.healthPointsChangeEvent.trigger(-points);
    }

    public setMaxHealth(maxHealth: number): void {
        this.maxHealthPoints = maxHealth;
    }
}
