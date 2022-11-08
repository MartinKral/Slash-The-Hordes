import { Collider2D, Contact2DType } from "cc";
import { GroupType } from "../GroupType";
import { Player } from "../Player/Player";
import { GameTimer } from "../../Services/GameTimer";
import { Enemy } from "../Enemy/Enemy";

export class PlayerCollisionSystem {
    private playerContacts: Collider2D[] = [];
    private collisionTimer: GameTimer;
    private player: Player;

    private groupToResolver: Map<number, (collider: Collider2D) => void> = new Map<number, (collider: Collider2D) => void>();

    public constructor(player: Player, collisionDelay: number) {
        this.player = player;

        player.Collider.on(Contact2DType.BEGIN_CONTACT, this.onPlayerContactBegin, this);
        player.Collider.on(Contact2DType.END_CONTACT, this.onPlayerContactEnd, this);

        this.collisionTimer = new GameTimer(collisionDelay);

        this.groupToResolver.set(GroupType.ENEMY, this.resolveEnemyContact.bind(this));
    }

    public gameTick(deltaTime: number): void {
        this.collisionTimer.gameTick(deltaTime);
        if (this.collisionTimer.tryFinishPeriod()) {
            this.resolveAllContacts();
        }
    }

    private onPlayerContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        this.playerContacts.push(otherCollider);
        this.resolveContact(otherCollider);
    }

    private onPlayerContactEnd(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        const index: number = this.playerContacts.indexOf(otherCollider);
        if (index != -1) {
            this.playerContacts.splice(index, 1);
        }
    }

    private resolveAllContacts(): void {
        for (let i = 0; i < this.playerContacts.length; i++) {
            this.resolveContact(this.playerContacts[i]);
        }
    }

    private resolveContact(otherCollider: Collider2D): void {
        if (this.groupToResolver.has(otherCollider.group)) {
            this.groupToResolver.get(otherCollider.group)(otherCollider);
        } else {
            console.log("Collided with undefined group: " + otherCollider.group);
        }
    }

    private resolveEnemyContact(enemyCollider: Collider2D): void {
        const damage: number = enemyCollider.node.getComponent(Enemy).Damage;
        console.log("Collided with enemy: Damage: " + damage);
        this.player.Health.damage(damage);
    }
}
