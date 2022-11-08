import { Collider2D, Contact2DType } from "cc";
import { Enemy, IDamageDealing } from "./Enemy";
import { Player } from "./Player";
import { Weapon } from "./Weapon";

export class CollisionSystem {
    public constructor(player: Player, weapon: Weapon) {
        player.Collider.on(Contact2DType.BEGIN_CONTACT, this.onPlayerContactBegin, this);
        weapon.Collider.on(Contact2DType.BEGIN_CONTACT, this.onWeaponContactBegin, this);
    }

    private onWeaponContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        console.log("Weapon contact! " + otherCollider.node.name);
    }

    private onPlayerContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        console.log("Player contact! " + otherCollider.node.name);
        const damageDealing: IDamageDealing = otherCollider.node.getComponent(Enemy);

        console.log("DAMAGE: " + damageDealing.Damage);
    }
}
