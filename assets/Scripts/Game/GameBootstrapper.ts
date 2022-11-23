import { Camera, CCFloat, CCInteger, Component, director, KeyCode, _decorator } from "cc";
import { ModalWindowManager } from "../Services/ModalWindowSystem/ModalWindowManager";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { EnemyManager } from "./Enemy/EnemyManager";
import { KeyboardInput } from "./Input/KeyboardInput";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { Player } from "./Player/Player";
import { GameUI } from "./UI/GameUI";
import { Weapon } from "./Weapon";
const { ccclass, property } = _decorator;

@ccclass("GameBootstrapper")
export class GameBootstrapper extends Component {
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(Weapon) private weapon: Weapon;
    @property(EnemyManager) private enemyManager: EnemyManager;
    @property(CCFloat) private strikeDelay = 0;
    @property(CCFloat) private collisionDelay = 0;
    @property(Camera) private camera: Camera;
    @property(GameUI) private gameUI: GameUI;
    @property(Number) private requiredLevelXps: number[] = [];
    @property(ModalWindowManager) private modalWindowManager: ModalWindowManager;

    private playerCollisionSystem: PlayerCollisionSystem;

    private isPaused = false;

    public start(): void {
        this.virtualJoystic.init();
        this.weapon.init(this.strikeDelay);
        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const dualInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);
        this.player.init(dualInput, this.weapon, 50, this.requiredLevelXps);

        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, this.collisionDelay);
        new WeaponCollisionSystem(this.weapon);

        this.enemyManager.init(this.player.node);

        this.gameUI.init(this.player);

        this.showModal();
    }

    public update(deltaTime: number): void {
        if (this.isPaused) return;

        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemyManager.gameTick(deltaTime);

        this.camera.node.worldPosition = this.player.node.worldPosition;
    }

    private async showModal(): Promise<void> {
        this.isPaused = true;
        const result: string = await this.modalWindowManager.showModal<string, string>("LevelUpModalWindow", "test params");
        this.isPaused = false;
        console.log("Result: " + result);
    }
}
