import { _decorator, Component, Node, AudioClip } from "cc";
import { AppRoot } from "../../AppRoot/AppRoot";
import { AudioPlayer } from "../../Services/AudioPlayer/AudioPlayer";
import { ItemManager, ItemType } from "../Items/ItemManager";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
const { ccclass, property } = _decorator;

@ccclass("GameAudioAdapter")
export class GameAudioAdapter extends Component {
    @property(AudioClip) private music: AudioClip;
    @property(AudioClip) private enemyHit: AudioClip;
    @property(AudioClip) private weaponSwing: AudioClip;
    @property(AudioClip) private xpPickup: AudioClip;
    @property(AudioClip) private goldPickup: AudioClip;
    @property(AudioClip) private healthPotionPickup: AudioClip;
    @property(AudioClip) private levelUp: AudioClip;

    private audioPlayer: AudioPlayer;

    public init(player: Player, enemyManager: EnemyManager, itemManager: ItemManager): void {
        AppRoot.Instance.AudioPlayer.playMusic(this.music);

        this.audioPlayer = AppRoot.Instance.AudioPlayer;

        player.Weapon.WeaponStrikeEvent.on(() => this.audioPlayer.playSound(this.weaponSwing), this);
        player.Level.LevelUpEvent.on(() => this.audioPlayer.playSound(this.levelUp), this);

        itemManager.PickupEvent.on(this.playPickupItemSound, this);

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

    private playPickupItemSound(itemType: ItemType): void {
        let clipToPlay: AudioClip;
        switch (itemType) {
            case ItemType.XP:
                clipToPlay = this.xpPickup;
                break;
            case ItemType.Gold:
                clipToPlay = this.goldPickup;
                break;
            case ItemType.HealthPotion:
                clipToPlay = this.healthPotionPickup;
                break;
            default:
                break;
        }

        this.audioPlayer.playSound(clipToPlay);
    }
}
