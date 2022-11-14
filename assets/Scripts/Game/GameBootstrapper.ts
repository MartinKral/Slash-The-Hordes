import { Component, KeyCode, _decorator } from "cc";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { EnemySpawner } from "./Enemy/EnemySpawner";
import { MultiInput } from "./Input/MultiInput";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { KeyboardInput } from "./Input/KeyboardInput";
import { Player } from "./Player/Player";
import { Weapon } from "./Weapon";
import { EnemyMover } from "./Enemy/EnemyMover";
const { ccclass, property } = _decorator;

@ccclass("GameBootstrapper")
export class GameBootstrapper extends Component {
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(Weapon) private weapon: Weapon;
    @property(EnemySpawner) private enemySpawner: EnemySpawner;
    @property(Number) private strikeDelay = 0;
    @property(Number) private collisionDelay = 0;
    private playerCollisionSystem: PlayerCollisionSystem;

    public start(): void {
        this.virtualJoystic.init();
        this.weapon.init(this.strikeDelay);
        const wasd = new KeyboardInput(KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D);
        const arrowKeys = new KeyboardInput(KeyCode.ARROW_UP, KeyCode.ARROW_DOWN, KeyCode.ARROW_LEFT, KeyCode.ARROW_RIGHT);
        const dualInput: MultiInput = new MultiInput([this.virtualJoystic, wasd, arrowKeys]);
        this.player.init(dualInput, this.weapon, 50);

        const enemyMover = new EnemyMover(this.player.node);
        this.enemySpawner.init(enemyMover);
        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, this.collisionDelay);
        new WeaponCollisionSystem(this.weapon);
    }

    public update(deltaTime: number): void {
        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemySpawner.gameTick(deltaTime);
    }
}
