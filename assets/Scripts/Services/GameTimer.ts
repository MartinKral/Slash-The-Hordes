export class GameTimer {
    private targetDelay: number;
    private currentDelay = 0;

    public constructor(targetDelay: number) {
        this.targetDelay = targetDelay;
    }

    public gameTick(deltaTime: number): void {
        this.currentDelay += deltaTime;
    }

    public tryFinishPeriod(): boolean {
        if (this.targetDelay <= this.currentDelay) {
            this.currentDelay = 0;
            return true;
        } else {
            return false;
        }
    }
}
