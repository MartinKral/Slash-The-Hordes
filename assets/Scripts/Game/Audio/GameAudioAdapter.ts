import { _decorator, Component, Node, AudioClip } from "cc";
import { AppRoot } from "../../AppRoot/AppRoot";
import { AudioPlayer } from "../../Services/AudioPlayer/AudioPlayer";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
const { ccclass, property } = _decorator;

@ccclass("GameAudioAdapter")
export class GameAudioAdapter extends Component {
    @property(AudioClip) private enemyHit: AudioClip;

    private audioPlayer: AudioPlayer;

    public init(enemyManager: EnemyManager): void {
        this.audioPlayer = AppRoot.Instance.AudioPlayer;

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);
    }

    private addEnemyListeners(enemy: Enemy): void {
        enemy.Health.HealthPointsChangeEvent.on(this.playEnemyHitSound, this);
    }

    private removeEnemyListeners(enemy: Enemy): void {
        enemy.Health.HealthPointsChangeEvent.off(this.playEnemyHitSound);
    }

    private playEnemyHitSound(): void {
        this.audioPlayer.playSound(this.enemyHit);
    }
}
