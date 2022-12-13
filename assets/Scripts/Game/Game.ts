import { Camera, Component, JsonAsset, KeyCode, Vec2, _decorator } from "cc";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { delay } from "../Services/Utils/AsyncUtils";
import { Background } from "./Background/Background";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { PlayerProjectileCollisionSystem } from "./Collision/PlayerProjectileCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { GameSettings, PlayerSettings } from "./Data/GameSettings";
import { TranslationData } from "./Data/TranslationData";
import { UserData } from "./Data/UserData";
import { KeyboardInput } from "./Input/KeyboardInput";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { GameModalLauncher } from "./ModalWIndows/GameModalLauncher";
import { Pauser } from "./Pauser";
import { GameUI } from "./UI/GameUI";
import { EnemyManager } from "./Unit/Enemy/EnemyManager";
import { MetaUpgrades } from "./Unit/MetaUpgrades/MetaUpgrades";
import { Player, PlayerData } from "./Unit/Player/Player";
import { HaloProjectileLauncher } from "./Unit/Player/ProjectileLauncher/HaloProjectileLauncher";
import { ProjectileData, ProjectileLauncher } from "./Unit/Player/ProjectileLauncher/ProjectileLauncher";
import { WaveProjectileLauncher } from "./Unit/Player/ProjectileLauncher/WaveProjectileLauncher";
import { Upgrader } from "./Upgrades/Upgrader";
import { MetaUpgradeType } from "./Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(ProjectileLauncher) private haloProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private horizontalProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private diagonalProjectileLauncherComponent: ProjectileLauncher;
    @property(EnemyManager) private enemyManager: EnemyManager;
    @property(Camera) private camera: Camera;
    @property(GameUI) private gameUI: GameUI;
    @property(Background) private background: Background;
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;
    @property(JsonAsset) private settingsAsset: JsonAsset;
    @property(JsonAsset) private translationAsset: JsonAsset;

    private playerCollisionSystem: PlayerCollisionSystem;
    private haloProjectileLauncher: HaloProjectileLauncher;
    private horizontalProjectileLauncher: WaveProjectileLauncher;
    private diagonalProjectileLauncher: WaveProjectileLauncher;

    private gamePauser: Pauser = new Pauser();

    private static instance: Game;

    public static get Instance(): Game {
        return this.instance;
    }

    public start(): void {
        Game.instance = this;
        this.gamePauser.pause();
    }

    public async playGame(userData: UserData): Promise<number> {
        const translationData = <TranslationData>this.translationAsset.json;
        const settings = <GameSettings>this.settingsAsset.json;
        const metaUpgrades = new MetaUpgrades(userData.game.metaUpgrades, settings.metaUpgrades);

        this.virtualJoystic.init();

        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const multiInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);

        this.player.init(multiInput, this.createPlayerData(settings.player, metaUpgrades));

        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, settings.player.collisionDelay);
        new WeaponCollisionSystem(this.player.Weapon);

        this.enemyManager.init(this.player.node, settings.enemyManager);

        const projectileData = new ProjectileData();
        projectileData.damage = 1 + metaUpgrades.getUpgradeValue(MetaUpgradeType.OverallDamage);
        projectileData.pierces = 1 + metaUpgrades.getUpgradeValue(MetaUpgradeType.ProjectilePiercing);

        this.haloProjectileLauncher = new HaloProjectileLauncher(
            this.haloProjectileLauncherComponent,
            this.player.node,
            settings.player.haloLauncher,
            projectileData
        );

        this.horizontalProjectileLauncher = new WaveProjectileLauncher(
            this.horizontalProjectileLauncherComponent,
            this.player.node,
            [new Vec2(-1, 0), new Vec2(1, 0)],
            settings.player.horizontalLauncher,
            projectileData
        );

        this.diagonalProjectileLauncher = new WaveProjectileLauncher(
            this.diagonalProjectileLauncherComponent,
            this.player.node,
            [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5)],
            settings.player.diagonalLauncher,
            projectileData
        );

        new PlayerProjectileCollisionSystem([this.haloProjectileLauncher, this.horizontalProjectileLauncher, this.diagonalProjectileLauncher]);

        const upgrader = new Upgrader(
            this.player,
            this.horizontalProjectileLauncher,
            this.haloProjectileLauncher,
            this.diagonalProjectileLauncher,
            settings.upgrades
        );
        new GameModalLauncher(this.modalWindowManager, this.player, this.gamePauser, upgrader, translationData);

        this.gameUI.init(this.player);
        this.background.init(this.player.node);
        this.gamePauser.resume();

        // while not dead
        await delay(1000000);
        this.gamePauser.pause();
        Game.instance = null;
        return 1;
    }

    public update(deltaTime: number): void {
        if (this.gamePauser.IsPaused) return;

        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemyManager.gameTick(deltaTime);
        this.haloProjectileLauncher.gameTick(deltaTime);
        this.horizontalProjectileLauncher.gameTick(deltaTime);
        this.diagonalProjectileLauncher.gameTick(deltaTime);
        this.background.gameTick();

        this.camera.node.worldPosition = this.player.node.worldPosition;
    }

    private createPlayerData(settings: PlayerSettings, metaUpgrades: MetaUpgrades): PlayerData {
        const playerData: PlayerData = Object.assign(new PlayerData(), settings);

        playerData.maxHp = metaUpgrades.getUpgradeValue(MetaUpgradeType.MaxHp) + settings.defaultHP;
        playerData.requiredXP = settings.requiredXP;
        playerData.speed = metaUpgrades.getUpgradeValue(MetaUpgradeType.MovementSpeed) + settings.speed;
        playerData.regenerationDelay = settings.regenerationDelay;
        playerData.xpMultiplier = metaUpgrades.getUpgradeValue(MetaUpgradeType.XPGatherer) + 1;
        playerData.goldMultiplier = metaUpgrades.getUpgradeValue(MetaUpgradeType.GoldGatherer) + 1;

        playerData.damage = metaUpgrades.getUpgradeValue(MetaUpgradeType.OverallDamage) + settings.weapon.damage;
        playerData.strikeDelay = settings.weapon.strikeDelay;

        return playerData;
    }
}
