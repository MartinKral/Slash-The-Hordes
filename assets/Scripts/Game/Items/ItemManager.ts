import { Component, random, randomRange, Vec3, _decorator } from "cc";
import { ISignal } from "../../Services/EventSystem/ISignal";
import { Signal } from "../../Services/EventSystem/Signal";
import { ItemSettings } from "../Data/GameSettings";
import { GameResult } from "../Game";
import { GameModalLauncher } from "../ModalWIndows/GameModalLauncher";
import { Enemy } from "../Unit/Enemy/Enemy";
import { EnemyManager } from "../Unit/Enemy/EnemyManager";
import { Player } from "../Unit/Player/Player";
import { Item } from "./Item";
import { ItemSpawner } from "./ItemSpawner";
import { ItemType } from "./ItemType";
import { PickupEffectManager } from "./PickupEffect/PickupEffectManager";

const { ccclass, property } = _decorator;

@ccclass("ItemManager")
export class ItemManager extends Component {
    @property(ItemSpawner) private xpSpawner: ItemSpawner;
    @property(ItemSpawner) private goldSpawner: ItemSpawner;
    @property(ItemSpawner) private healthPotionSpawner: ItemSpawner;
    @property(ItemSpawner) private magnetSpawner: ItemSpawner;
    @property(ItemSpawner) private chestSpawner: ItemSpawner;
    @property(PickupEffectManager) private pickupEffectManager: PickupEffectManager;

    private player: Player;
    private gameResult: GameResult;
    private modalLauncher: GameModalLauncher;
    private healthPerPotion: number;

    private pickupEvent = new Signal<ItemType>();

    private itemTypeToAction = new Map<ItemType, () => void>();

    public init(enemyManager: EnemyManager, player: Player, gameResult: GameResult, modalLauncher: GameModalLauncher, settings: ItemSettings): void {
        this.player = player;
        this.gameResult = gameResult;
        this.modalLauncher = modalLauncher;
        this.healthPerPotion = settings.healthPerPotion;

        enemyManager.EnemyAddedEvent.on(this.addEnemyListeners, this);
        enemyManager.EnemyRemovedEvent.on(this.removeEnemyListeners, this);

        this.xpSpawner.init();
        this.goldSpawner.init();
        this.healthPotionSpawner.init();
        this.magnetSpawner.init();
        this.chestSpawner.init();

        this.pickupEffectManager.init();

        this.itemTypeToAction.set(ItemType.XP, this.addXP.bind(this));
        this.itemTypeToAction.set(ItemType.Gold, this.addGold.bind(this));
        this.itemTypeToAction.set(ItemType.HealthPotion, this.useHealthPotion.bind(this));
        this.itemTypeToAction.set(ItemType.Magnet, this.activateMagnet.bind(this));
        this.itemTypeToAction.set(ItemType.Chest, this.openChest.bind(this));
    }

    public get PickupEvent(): ISignal<ItemType> {
        return this.pickupEvent;
    }

    public pickupItem(item: Item): void {
        if (!this.itemTypeToAction.has(item.ItemType)) throw new Error("Does not have behaviour set for " + item.ItemType);

        this.pickupEffectManager.showEffect(item.node.worldPosition);
        this.itemTypeToAction.get(item.ItemType)();
        this.pickupEvent.trigger(item.ItemType);

        item.pickup();
    }

    private addXP(): void {
        this.player.Level.addXp(1);
    }

    private addGold(): void {
        this.gameResult.goldCoins++;
    }

    private useHealthPotion(): void {
        this.player.Health.heal(this.healthPerPotion);
    }

    private activateMagnet(): void {
        this.player.Magnet.activate();
    }

    private openChest(): void {
        this.modalLauncher.showChestModal();
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
        ItemManager.trySpawnOnce(enemy.HealthPotionRewardChance, this.healthPotionSpawner, this.getRandomPosition(enemy));
        ItemManager.trySpawnOnce(enemy.MagnetRewardChance, this.magnetSpawner, this.getRandomPosition(enemy));
        ItemManager.trySpawnOnce(enemy.ChestRewardChance, this.chestSpawner, this.getRandomPosition(enemy));
    }

    private trySpawnXP(enemy: Enemy): void {
        for (let index = 0; index < enemy.XPReward; index++) {
            this.xpSpawner.spawn(this.getRandomPosition(enemy));
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

    private static trySpawnOnce(chance: number, itemSpawner: ItemSpawner, worldPosition: Vec3): void {
        if (random() < chance) {
            itemSpawner.spawn(worldPosition);
        }
    }

    private getRandomPosition(enemy: Enemy): Vec3 {
        const position: Vec3 = enemy.node.worldPosition;
        position.x += randomRange(-15, 15);
        position.y += randomRange(-15, 15);

        return position;
    }
}
