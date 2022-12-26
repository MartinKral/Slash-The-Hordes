import { Camera, Component, KeyCode, Prefab, Vec2, _decorator } from "cc";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { delay } from "../Services/Utils/AsyncUtils";
import { GameAudioAdapter } from "./Audio/GameAudioAdapter";
import { Background } from "./Background/Background";
import { MagnetCollisionSystem } from "./Collision/MagnetCollisionSystem";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { PlayerProjectileCollisionSystem } from "./Collision/PlayerProjectileCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { GameSettings, PlayerSettings } from "./Data/GameSettings";
import { TranslationData } from "./Data/TranslationData";
import { UserData } from "./Data/UserData";
import { KeyboardInput } from "./Input/KeyboardInput";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { ItemAttractor } from "./Items/ItemAttractor";
import { ItemManager } from "./Items/ItemManager";
import { GameModalLauncher } from "./ModalWIndows/GameModalLauncher";
import { Pauser } from "./Pauser";
import { TestValues } from "./TestGameRunner";
import { GameUI } from "./UI/GameUI";
import { EnemyManager } from "./Unit/Enemy/EnemyManager";
import { EnemyProjectileLauncher } from "./Unit/Enemy/ProjectileLauncher.cs/EnemyProjectileLauncher";
import { MetaUpgrades } from "./Unit/MetaUpgrades/MetaUpgrades";
import { Player, PlayerData } from "./Unit/Player/Player";
import { HaloProjectileLauncher } from "./Unit/Player/ProjectileLauncher/HaloProjectileLauncher";
import { ProjectileData } from "./Unit/Player/ProjectileLauncher/ProjectileData";
import { ProjectileLauncher } from "./Unit/Player/ProjectileLauncher/ProjectileLauncher";
import { WaveProjectileLauncher } from "./Unit/Player/ProjectileLauncher/WaveProjectileLauncher";
import { Upgrader } from "./Upgrades/Upgrader";
import { MetaUpgradeType } from "./Upgrades/UpgradeType";

const { ccclass, property } = _decorator;

@ccclass("Game")
export class Game extends Component {
    private static instance: Game;

    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(ProjectileLauncher) private haloProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private horizontalProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private diagonalProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private enemyAxeProjectileLauncherComponent: ProjectileLauncher;
    @property(ProjectileLauncher) private enemyMagicOrbProjectileLauncherComponent: ProjectileLauncher;
    @property(EnemyManager) private enemyManager: EnemyManager;
    @property(ItemManager) private itemManager: ItemManager;
    @property(Camera) private camera: Camera;
    @property(GameUI) private gameUI: GameUI;
    @property(Background) private background: Background;
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;
    @property(GameAudioAdapter) private gameAudioAdapter: GameAudioAdapter;

    private playerCollisionSystem: PlayerCollisionSystem;
    private haloProjectileLauncher: HaloProjectileLauncher;
    private horizontalProjectileLauncher: WaveProjectileLauncher;
    private diagonalProjectileLauncher: WaveProjectileLauncher;

    private enemyAxeProjectileLauncher: EnemyProjectileLauncher;
    private enemyMagicOrbProjectileLauncher: EnemyProjectileLauncher;

    private itemAttractor: ItemAttractor;

    private gamePauser: Pauser = new Pauser();
    private gameResult: GameResult;

    private timeAlive = 0;

    public static get Instance(): Game {
        return this.instance;
    }

    public start(): void {
        Game.instance = this;
        this.gamePauser.pause();
    }

    public async playGame(
        userData: UserData,
        settings: GameSettings,
        translationData: TranslationData,
        testValues?: TestValues
    ): Promise<GameResult> {
        this.gameResult = new GameResult();
        const metaUpgrades = new MetaUpgrades(userData.game.metaUpgrades, settings.metaUpgrades);

        this.virtualJoystic.init();

        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const multiInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);

        this.player.init(multiInput, this.createPlayerData(settings.player, metaUpgrades));
        this.enemyManager.init(this.player.node, settings.enemyManager);
        this.itemManager.init(this.enemyManager, this.player, this.gameResult, settings.items);

        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, settings.player.collisionDelay, this.itemManager);
        new WeaponCollisionSystem(this.player.Weapon);

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

        this.enemyAxeProjectileLauncher = new EnemyProjectileLauncher(
            this.enemyAxeProjectileLauncherComponent,
            this.player.node,
            this.enemyManager,
            settings.enemyManager.axeLauncher
        );

        this.enemyMagicOrbProjectileLauncher = new EnemyProjectileLauncher(
            this.enemyMagicOrbProjectileLauncherComponent,
            this.player.node,
            this.enemyManager,
            settings.enemyManager.magicOrbLauncher
        );

        new PlayerProjectileCollisionSystem([this.haloProjectileLauncher, this.horizontalProjectileLauncher, this.diagonalProjectileLauncher]);

        this.itemAttractor = new ItemAttractor(this.player.node, 100);
        new MagnetCollisionSystem(this.player.Magnet, this.itemAttractor);

        const upgrader = new Upgrader(
            this.player,
            this.horizontalProjectileLauncher,
            this.haloProjectileLauncher,
            this.diagonalProjectileLauncher,
            settings.upgrades
        );
        const modalLauncher = new GameModalLauncher(this.modalWindowManager, this.player, this.gamePauser, upgrader, translationData);

        this.gameUI.init(this.player, modalLauncher);
        this.background.init(this.player.node);

        if (testValues) {
            this.timeAlive += testValues.startTime;
            this.player.Level.addXp(testValues.startXP);
        }

        this.gameAudioAdapter.init(
            this.player,
            this.enemyManager,
            this.itemManager,
            this.horizontalProjectileLauncher,
            this.diagonalProjectileLauncher,
            this.haloProjectileLauncher
        );
        this.gamePauser.resume();

        while (!this.gameResult.hasExitManually && this.player.Health.IsAlive) await delay(100);
        if (!this.gameResult.hasExitManually) {
            await delay(1000);
        }
        this.gamePauser.pause();
        Game.instance = null;
        this.gameResult.score = this.timeAlive;
        return this.gameResult;
    }

    public exitGame(): void {
        this.gameResult.hasExitManually = true;
    }

    public update(deltaTime: number): void {
        if (this.gamePauser.IsPaused) return;

        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemyManager.gameTick(deltaTime);
        this.haloProjectileLauncher.gameTick(deltaTime);
        this.horizontalProjectileLauncher.gameTick(deltaTime);
        this.diagonalProjectileLauncher.gameTick(deltaTime);
        this.enemyAxeProjectileLauncher.gameTick(deltaTime);
        this.enemyMagicOrbProjectileLauncher.gameTick(deltaTime);
        this.itemAttractor.gameTick(deltaTime);
        this.background.gameTick();

        this.timeAlive += deltaTime;
        this.gameUI.updateTimeAlive(this.timeAlive);

        this.camera.node.worldPosition = this.player.node.worldPosition;
    }

    private createPlayerData(settings: PlayerSettings, metaUpgrades: MetaUpgrades): PlayerData {
        const playerData: PlayerData = Object.assign(new PlayerData(), settings);

        playerData.maxHp = metaUpgrades.getUpgradeValue(MetaUpgradeType.Health) + settings.defaultHP;
        playerData.requiredXP = settings.requiredXP;
        playerData.speed = metaUpgrades.getUpgradeValue(MetaUpgradeType.MovementSpeed) + settings.speed;
        playerData.regenerationDelay = settings.regenerationDelay;
        playerData.xpMultiplier = metaUpgrades.getUpgradeValue(MetaUpgradeType.XPGatherer) + 1;
        playerData.goldMultiplier = metaUpgrades.getUpgradeValue(MetaUpgradeType.GoldGatherer) + 1;

        playerData.damage = metaUpgrades.getUpgradeValue(MetaUpgradeType.OverallDamage) + settings.weapon.damage;
        playerData.strikeDelay = settings.weapon.strikeDelay;

        playerData.magnetDuration = settings.magnetDuration;

        return playerData;
    }
}

export class GameResult {
    public hasExitManually = false;
    public goldCoins = 0;
    public score = 0;
}
