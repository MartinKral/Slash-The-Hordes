export abstract class DelayedEnemySpawner {
    private currentTime = 0;
    public constructor(private startDelay: number, private stopDelay: number) {
        if (stopDelay === -1) {
            this.stopDelay = Number.MAX_SAFE_INTEGER;
        }
    }

    public gameTick(deltaTime: number): void {
        this.currentTime += deltaTime;
        if (this.startDelay <= this.currentTime && this.currentTime <= this.stopDelay) {
            this.delayedGameTick(deltaTime);
        }
    }

    public abstract delayedGameTick(deltaTime: number): void;
}
