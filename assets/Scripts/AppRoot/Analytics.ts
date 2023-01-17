import { Y8 } from "../../Plugins/Y8/Scripts/Y8";

export class Analytics {
    private totalTime = 0;
    private minutesInGame = -1; // Track the 0 minute as well
    private gamesPerSession = 0;

    public constructor(private y8: Y8) {}

    public update(deltaTime: number): void {
        this.totalTime += deltaTime;
        this.trySendTotalTime();
    }

    public gameStart(): void {
        this.y8.sendCustomEvent(EventName.GAMES_PER_SESSION, ++this.gamesPerSession);
    }

    public gameEnd(time: number): void {
        this.y8.sendCustomEvent(EventName.GAME_TIME, Math.floor(time));
    }

    public gameExit(time: number): void {
        this.y8.sendCustomEvent(EventName.GAME_EXIT, Math.floor(time));
    }

    public goldPerRun(goldEarned: number): void {
        this.y8.sendCustomEvent(EventName.GOLD_PER_RUN, Math.floor(goldEarned));
    }

    private trySendTotalTime(): void {
        if (this.minutesInGame < Math.floor(this.totalTime / 60)) {
            this.y8.sendCustomEvent(EventName.TOTAL_TIME, ++this.minutesInGame);
        }
    }
}

enum EventName {
    TOTAL_TIME = "Minutes_total_v0.2",
    GOLD_PER_RUN = "Gold_per_run_v0.2",
    GAMES_PER_SESSION = "Games_per_session_v0.2",
    GAME_TIME = "Game_time_seconds_v0.2",
    GAME_EXIT = "Game_exit_v0.2"
}
