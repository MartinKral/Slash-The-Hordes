import { Component, ProgressBar, _decorator } from "cc";
import { UnitHealth } from "../../UnitHealth";
const { ccclass, property } = _decorator;

@ccclass("PlayerHealthUI")
export class PlayerHealthUI extends Component {
    @property(ProgressBar) public healthBar: ProgressBar;
    private health: UnitHealth;

    public init(health: UnitHealth): void {
        this.healthBar.progress = 1;
        this.health = health;
        this.health.HealthPointsChangeEvent.on(this.updateHealthBar, this);
    }

    private updateHealthBar(): void {
        this.healthBar.progress = this.health.HealthPoints / this.health.MaxHealthPoints;
    }
}
