import { Component, random, randomRange, Vec3, _decorator } from "cc";
import { GameResult } from "../Game";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
import { Gold } from "./Gold/Gold";
import { GoldSpawner } from "./Gold/GoldSpawner";
import { PickupEffectManager } from "./PickupEffect/PickupEffectManager";
import { XP } from "./XP/XP";
import { XPSpawner } from "./XP/XPSpawner";
const { ccclass, property } = _decorator;

@ccclass("ItemManager")
export class ItemManager extends Component {
    @property(XPSpawner) private xpSpawner: XPSpawner;
    @property(GoldSpawner) private goldSpawner: GoldSpawner;
    @property(PickupEffectManager) private pickupEffectManager: PickupEffectManager;

    private player: Player;
    private gameResult: GameResult;

    public init(enemyManager: EnemyManager, player: Player, gameResult: GameResult): void {
        this.player = player;
        this.gameResult = gameResult;

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);

        this.xpSpawner.init();
        this.goldSpawner.init();
        this.pickupEffectManager.init();
    }

    public pickupXP(xp: XP): void {
        this.pickupEffectManager.showEffect(xp.node.worldPosition);

        this.player.Level.addXp(xp.Value);
        xp.pickup();
    }

    public pickupGold(gold: Gold): void {
        this.pickupEffectManager.showEffect(gold.node.worldPosition);

        gold.pickup();
        this.gameResult.goldCoins++;
    }

    private addEnemyListeners(enemy: Enemy): void {
        enemy.DeathEvent.on(this.trySpawnItems, this);
    }

    private removeEnemyListeners(enemy: Enemy): void {
        enemy.DeathEvent.off(this.trySpawnItems);
    }

    private trySpawnItems(enemy: Enemy): void {
        this.trySpawnXP(enemy);
        this.trySpawnGold(enemy);
    }

    private trySpawnXP(enemy: Enemy): void {
        for (let index = 0; index < enemy.XPReward; index++) {
            this.xpSpawner.spawnXp(this.getRandomPosition(enemy), 1);
        }
    }

    private trySpawnGold(enemy: Enemy): void {
        if (enemy.GoldReward <= 0) return;

        if (enemy.GoldReward < 1) {
            if (random() < enemy.GoldReward) {
                this.goldSpawner.spawn(enemy.node.worldPosition);
            }
        } else {
            for (let i = 0; i < enemy.GoldReward; i++) {
                this.goldSpawner.spawn(this.getRandomPosition(enemy));
            }
        }
    }

    private getRandomPosition(enemy: Enemy): Vec3 {
        const position: Vec3 = enemy.node.worldPosition;
        position.x += randomRange(-10, 10);
        position.y += randomRange(-10, 10);

        return position;
    }
}
