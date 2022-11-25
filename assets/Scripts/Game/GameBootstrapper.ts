import { Camera, CCFloat, CCInteger, Component, director, JsonAsset, KeyCode, _decorator } from "cc";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { GameSettings } from "./Data/GameSettings";
import { EnemyManager } from "./Enemy/EnemyManager";
import { KeyboardInput } from "./Input/KeyboardInput";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { GameModalLauncher } from "./ModalWIndows/GameModalLauncher";
import { Pauser } from "./Pauser";
import { Player } from "./Player/Player";
import { GameUI } from "./UI/GameUI";
import { Upgrader } from "./Upgrades/Upgrader";
import { UpgradeType } from "./Upgrades/UpgradeType";
import { Weapon } from "./Weapon";
const { ccclass, property } = _decorator;

@ccclass("GameBootstrapper")
export class GameBootstrapper extends Component {
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(Weapon) private weapon: Weapon;
    @property(EnemyManager) private enemyManager: EnemyManager;
    @property(Camera) private camera: Camera;
    @property(GameUI) private gameUI: GameUI;
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;
    @property(JsonAsset) private settingsAsset: JsonAsset;

    private playerCollisionSystem: PlayerCollisionSystem;

    private gamePauser: Pauser = new Pauser();

    public start(): void {
        const gameSettings: GameSettings = <GameSettings>this.settingsAsset.json;

        this.virtualJoystic.init();
        this.weapon.init(gameSettings.weaponSettings.strikeDelay);
        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const dualInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);
        this.player.init(dualInput, this.weapon, gameSettings.playerSettings.defaultHP, gameSettings.playerSettings.requiredXP);

        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, gameSettings.playerSettings.collisionDelay);
        new WeaponCollisionSystem(this.weapon);

        const upgrader = new Upgrader(this.player);
        new GameModalLauncher(this.modalWindowManager, this.player, this.gamePauser, upgrader);

        this.enemyManager.init(this.player.node);

        this.gameUI.init(this.player);
    }

    public update(deltaTime: number): void {
        if (this.gamePauser.IsPaused) return;

        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemyManager.gameTick(deltaTime);

        this.camera.node.worldPosition = this.player.node.worldPosition;
    }
}
