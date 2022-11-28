import { GameTimer } from "../../../Services/GameTimer";
import { UnitHealth } from "../UnitHealth";

export class PlayerRegeneration {
    private currentRegenerationAmount = 0;
    private regenerationDelay: number;
    private regenerationTimer: GameTimer = new GameTimer(0);
    private health: UnitHealth;

    public constructor(health: UnitHealth, regenerationDelay: number) {
        this.health = health;
        this.regenerationDelay = regenerationDelay;
    }

    public upgrade(): void {
        this.currentRegenerationAmount++;
        this.regenerationTimer = new GameTimer(this.regenerationDelay / this.currentRegenerationAmount);
    }

    public gameTick(deltaTime: number): void {
        if (this.currentRegenerationAmount <= 0) return;

        this.regenerationTimer.gameTick(deltaTime);
        if (this.regenerationTimer.tryFinishPeriod()) {
            this.health.heal(1);
        }
    }
}
