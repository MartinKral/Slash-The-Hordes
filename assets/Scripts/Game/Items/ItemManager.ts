import { Component, random, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ItemSettings } from "../Data/GameSettings";
import { GameResult } from "../Game";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
import { Gold } from "./Gold/Gold";
import { GoldSpawner } from "./Gold/GoldSpawner";
import { HealthPotion } from "./HealthPotion/HealthPotion";
import { HealthPotionSpawner } from "./HealthPotion/HealthPotionSpawner";
import { PickupEffectManager } from "./PickupEffect/PickupEffectManager";
import { XP } from "./XP/XP";
import { XPSpawner } from "./XP/XPSpawner";
const { ccclass, property } = _decorator;

@ccclass("ItemManager")
export class ItemManager extends Component {
    @property(XPSpawner) private xpSpawner: XPSpawner;
    @property(GoldSpawner) private goldSpawner: GoldSpawner;
    @property(HealthPotionSpawner) private healthPotionSpawner: HealthPotionSpawner;
    @property(PickupEffectManager) private pickupEffectManager: PickupEffectManager;

    private player: Player;
    private gameResult: GameResult;
    private healthPerPotion: number;

    private pickupEvent = new Signal<ItemType>();

    public init(enemyManager: EnemyManager, player: Player, gameResult: GameResult, settings: ItemSettings): void {
        this.player = player;
        this.gameResult = gameResult;
        this.healthPerPotion = settings.healthPerPotion;

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);

        this.xpSpawner.init();
        this.goldSpawner.init();
        this.healthPotionSpawner.init();
        this.pickupEffectManager.init();
    }

    public get PickupEvent(): ISignal<ItemType> {
        return this.pickupEvent;
    }

    public pickupXP(xp: XP): void {
        this.pickupEffectManager.showEffect(xp.node.worldPosition);
        this.pickupEvent.trigger(ItemType.XP);

        this.player.Level.addXp(xp.Value);
        xp.pickup();
    }

    public pickupGold(gold: Gold): void {
        this.pickupEffectManager.showEffect(gold.node.worldPosition);
        this.pickupEvent.trigger(ItemType.Gold);

        gold.pickup();
        this.gameResult.goldCoins++;
    }

    public pickupHealthPotion(healthPotion: HealthPotion): void {
        this.pickupEffectManager.showEffect(healthPotion.node.worldPosition);
        this.pickupEvent.trigger(ItemType.HealthPotion);

        healthPotion.pickup();
        this.player.Health.heal(this.healthPerPotion);
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
        this.trySpawnHealthPotion(enemy);
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

    private trySpawnHealthPotion(enemy: Enemy): void {
        if (enemy.HealthPotionRewardChance <= 0) return;

        console.log("random: " + random() + " chance " + enemy.HealthPotionRewardChance);
        if (random() < enemy.HealthPotionRewardChance) {
            this.healthPotionSpawner.spawn(enemy.node.worldPosition);
        }
    }

    private getRandomPosition(enemy: Enemy): Vec3 {
        const position: Vec3 = enemy.node.worldPosition;
        position.x += randomRange(-10, 10);
        position.y += randomRange(-10, 10);

        return position;
    }
}

export enum ItemType {
    XP,
    Gold,
    HealthPotion
}
