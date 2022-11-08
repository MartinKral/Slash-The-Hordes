import { Component, _decorator } from "cc";
import { PlayerCollisionSystem } from "./Collision/PlayerCollisionSystem";
import { WeaponCollisionSystem } from "./Collision/WeaponCollisionSystem";
import { EnemySpawner } from "./Enemy/EnemySpawner";
import { VirtualJoystic } from "./Input/VirtualJoystic";
import { Player } from "./Player/Player";
import { Weapon } from "./Weapon";
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
        this.player.init(this.virtualJoystic, this.weapon, 50);
        this.enemySpawner.init();
        this.playerCollisionSystem = new PlayerCollisionSystem(this.player, this.collisionDelay);
        new WeaponCollisionSystem(this.weapon);
    }

    public update(deltaTime: number): void {
        this.player.gameTick(deltaTime);
        this.playerCollisionSystem.gameTick(deltaTime);
        this.enemySpawner.gameTick(deltaTime);
    }
}
