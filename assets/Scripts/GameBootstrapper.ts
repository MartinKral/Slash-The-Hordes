import { Component, instantiate, Prefab, random, randomRange, Vec3, _decorator } from "cc";
import { CollisionSystem } from "./CollisionSystem";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { ObjectPool } from "./Services/ObjectPool";
import { VirtualJoystic } from "./VirtualJoystic";
import { Weapon } from "./Weapon";
const { ccclass, property } = _decorator;

@ccclass("GameBootstrapper")
export class GameBootstrapper extends Component {
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(Weapon) private weapon: Weapon;
    @property(Prefab) private enemy: Prefab;
    @property(Number) private strikeDelay = 0;

    public start(): void {
        this.virtualJoystic.init();
        this.weapon.init(this.strikeDelay);
        this.player.init(this.virtualJoystic, this.weapon);

        new CollisionSystem(this.player, this.weapon);

        const op: ObjectPool<Player> = new ObjectPool(this.enemy, this.node, 10, Player);

        const borrowed: Player[] = [];
        for (let index = 0; index < 7; index++) {
            const enemy: Player = op.borrow();
            enemy.node.parent = this.node;
            enemy.node.active = true;
            enemy.node.setPosition(new Vec3(randomRange(-200, 200)));

            if (index < 5) borrowed.push(enemy);
        }

        borrowed.forEach((borrowedEnemy) => {
            op.return(borrowedEnemy);
        });
    }

    public update(deltaTime: number): void {
        this.player.gameTick(deltaTime);
    }

    public getEnemy<T extends Component>(): T {
        const i = instantiate(this.enemy);
        i.parent = this.node;
        return <T>i.getComponent(Enemy.name);
    }
}
