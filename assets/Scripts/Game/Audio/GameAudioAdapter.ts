import { _decorator, Component, Node, AudioClip } from "cc";
import { AppRoot } from "../../AppRoot/AppRoot";
import { AudioPlayer } from "../../Services/AudioPlayer/AudioPlayer";
import { ItemManager } from "../Items/ItemManager";
import { ItemType } from "../Items/ItemType";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
import { HaloProjectileLauncher } from "../Projectile/ProjectileLauncher/HaloProjectileLauncher";
import { WaveProjectileLauncher } from "../Projectile/ProjectileLauncher/WaveProjectileLauncher";
const { ccclass, property } = _decorator;

@ccclass("GameAudioAdapter")
export class GameAudioAdapter extends Component {
    @property(AudioClip) private music: AudioClip;
    @property(AudioClip) private enemyHit: AudioClip;
    @property(AudioClip) private playerHit: AudioClip;
    @property(AudioClip) private playerDeath: AudioClip;
    @property(AudioClip) private weaponSwing: AudioClip;
    @property(AudioClip) private xpPickup: AudioClip;
    @property(AudioClip) private goldPickup: AudioClip;
    @property(AudioClip) private healthPotionPickup: AudioClip;
    @property(AudioClip) private magnetPickup: AudioClip;
    @property(AudioClip) private chestPickup: AudioClip;
    @property(AudioClip) private levelUp: AudioClip;
    @property(AudioClip) private horizontalProjectileLaunch: AudioClip;
    @property(AudioClip) private diagonalProjectileLaunch: AudioClip;
    @property(AudioClip) private haloProjectileLaunch: AudioClip;

    private audioPlayer: AudioPlayer;
    private player: Player;

    public init(
        player: Player,
        enemyManager: EnemyManager,
        itemManager: ItemManager,
        horizontalLauncher: WaveProjectileLauncher,
        diagonalLauncher: WaveProjectileLauncher,
        haloLauncher: HaloProjectileLauncher
    ): void {
        AppRoot.Instance.AudioPlayer.playMusic(this.music);

        this.audioPlayer = AppRoot.Instance.AudioPlayer;
        this.player = player;

        player.Weapon.WeaponStrikeEvent.on(() => this.audioPlayer.playSound(this.weaponSwing), this);
        player.Level.LevelUpEvent.on(() => this.audioPlayer.playSound(this.levelUp), this);
        player.Health.HealthPointsChangeEvent.on(this.tryPlayPlayerHitSound, this);

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);

        itemManager.PickupEvent.on(this.playPickupItemSound, this);

        horizontalLauncher.ProjectileLaunchedEvent.on(() => this.audioPlayer.playSound(this.horizontalProjectileLaunch), this);
        diagonalLauncher.ProjectileLaunchedEvent.on(() => this.audioPlayer.playSound(this.diagonalProjectileLaunch), this);
        haloLauncher.ProjectilesLaunchedEvent.on(() => this.audioPlayer.playSound(this.haloProjectileLaunch), this);
    }

    private addEnemyListeners(enemy: Enemy): void {
        enemy.Health.HealthPointsChangeEvent.on(this.playEnemyHitSound, this);
    }

    private removeEnemyListeners(enemy: Enemy): void {
        enemy.Health.HealthPointsChangeEvent.off(this.playEnemyHitSound);
    }

    private tryPlayPlayerHitSound(healthChange: number): void {
        if (healthChange < 0) {
            this.audioPlayer.playSound(this.playerHit);
        }

        if (!this.player.Health.IsAlive) {
            this.audioPlayer.playSound(this.playerDeath);
        }
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
            case ItemType.Magnet:
                clipToPlay = this.magnetPickup;
                break;
            case ItemType.Chest:
                clipToPlay = this.chestPickup;
                break;
            default:
                break;
        }

        this.audioPlayer.playSound(clipToPlay);
    }
}
