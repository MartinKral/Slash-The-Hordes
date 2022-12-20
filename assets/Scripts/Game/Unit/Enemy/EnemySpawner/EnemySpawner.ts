import { _decorator, Component, Prefab, Vec3, Node } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { Signal } from "../../../../Services/EventSystem/Signal";
import { ObjectPool } from "../../../../Services/ObjectPool";
import { EnemySettings } from "../../../Data/GameSettings";
import { Enemy } from "../Enemy";
import { EnemyGraphicsType } from "../EnemyGraphicsType";

const { ccclass, property } = _decorator;

@ccclass("EnemySpawner")
export class EnemySpawner extends Component {
    @property(Prefab) private enemies: Prefab[] = [];

    private enemyAddedEvent: Signal<Enemy> = new Signal<Enemy>();
    private enemyRemovedEvent: Signal<Enemy> = new Signal<Enemy>();

    private enemyGraphicsTypeToPool = new Map<EnemyGraphicsType, ObjectPool<Enemy>>();
    private targetNode: Node;

    private idToSettings = new Map<string, EnemySettings>();

    public init(targetNode: Node, enemiesSettings: EnemySettings[]): void {
        this.targetNode = targetNode;

        for (const enemy of this.enemies) {
            const enemyPool: ObjectPool<Enemy> = new ObjectPool(enemy, this.node, 50, "Enemy");
            this.enemyGraphicsTypeToPool.set(<EnemyGraphicsType>enemy.name, enemyPool);
        }

        for (const enemySettings of enemiesSettings) {
            this.idToSettings.set(enemySettings.id, enemySettings);
        }
    }

    public get EnemyAddedEvent(): ISignal<Enemy> {
        return this.enemyAddedEvent;
    }

    public get EnemyRemovedEvent(): ISignal<Enemy> {
        return this.enemyRemovedEvent;
    }

    public spawnNewEnemy(positionX: number, positionY: number, id: string): Enemy {
        if (!this.idToSettings.has(id)) {
            throw new Error("Does not have setting for enemy " + id);
        }

        const enemySettings = this.idToSettings.get(id);

        const enemy = this.enemyGraphicsTypeToPool.get(<EnemyGraphicsType>enemySettings.graphicsType).borrow();
        const spawnPosition = new Vec3();
        spawnPosition.x = this.targetNode.worldPosition.x + positionX;
        spawnPosition.y = this.targetNode.worldPosition.y + positionY;
        enemy.setup(spawnPosition, enemySettings);

        enemy.DeathEvent.on(this.returnEnemy, this);
        enemy.LifetimeEndedEvent.on(this.returnEnemy, this);

        this.enemyAddedEvent.trigger(enemy);

        return enemy;
    }

    public returnEnemy(enemy: Enemy): void {
        enemy.DeathEvent.off(this.returnEnemy);
        enemy.LifetimeEndedEvent.off(this.returnEnemy);

        console.log(enemy.name);
        this.enemyGraphicsTypeToPool.get(<EnemyGraphicsType>enemy.node.name).return(enemy);

        this.enemyRemovedEvent.trigger(enemy);
    }
}
