import { Camera, Component, JsonAsset, KeyCode, Vec2, _decorator } from "cc";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { delay } from "../Services/Utils/AsyncUtils";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { PlayerProjectileCollisionSystem } from "./Collision/PlayerProjectileCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { GameSettings } from "./Data/GameSettings";
import { KeyboardInput } from "./Input/KeyboardInput";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { GameModalLauncher } from "./ModalWIndows/GameModalLauncher";
import { Pauser } from "./Pauser";
import { GameUI } from "./UI/GameUI";
import { EnemyManager } from "./Unit/Enemy/EnemyManager";
import { Player } from "./Unit/Player/Player";
import { HaloProjectileLauncher } from "./Unit/Player/ProjectileLauncher/HaloProjectileLauncher";
import { ProjectileLauncher } from "./Unit/Player/ProjectileLauncher/ProjectileLauncher";
import { WaveProjectileLauncher } from "./Unit/Player/ProjectileLauncher/WaveProjectileLauncher";
import { Upgrader } from "./Upgrades/Upgrader";

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
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;
    @property(JsonAsset) private settingsAsset: JsonAsset;

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

    public async playGame(): Promise<number> {
        const settings: GameSettings = <GameSettings>this.settingsAsset.json;

        this.virtualJoystic.init();

        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const multiInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);
        this.player.init(multiInput, settings.player);

        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, settings.player.collisionDelay);
        new WeaponCollisionSystem(this.player.Weapon);

        this.enemyManager.init(this.player.node, settings.enemyManager);

        this.haloProjectileLauncher = new HaloProjectileLauncher(
            this.haloProjectileLauncherComponent,
            this.player.node,
            settings.player.haloLauncher
        );

        this.horizontalProjectileLauncher = new WaveProjectileLauncher(
            this.horizontalProjectileLauncherComponent,
            this.player.node,
            [new Vec2(-1, 0), new Vec2(1, 0)],
            settings.player.horizontalLauncher
        );

        this.diagonalProjectileLauncher = new WaveProjectileLauncher(
            this.diagonalProjectileLauncherComponent,
            this.player.node,
            [new Vec2(-0.5, -0.5), new Vec2(0.5, -0.5)],
            settings.player.diagonalLauncher
        );

        new PlayerProjectileCollisionSystem([this.haloProjectileLauncher, this.horizontalProjectileLauncher, this.diagonalProjectileLauncher]);

        const upgrader = new Upgrader(
            this.player,
            this.horizontalProjectileLauncher,
            this.haloProjectileLauncher,
            this.diagonalProjectileLauncher,
            settings.upgrades
        );
        new GameModalLauncher(this.modalWindowManager, this.player, this.gamePauser, upgrader);

        this.gameUI.init(this.player);
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

        this.camera.node.worldPosition = this.player.node.worldPosition;
    }
}
