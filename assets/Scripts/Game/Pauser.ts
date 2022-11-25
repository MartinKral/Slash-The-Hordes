export class Pauser {
    private isPaused = false;

    public get IsPaused(): boolean {
        return this.isPaused;
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }
}
