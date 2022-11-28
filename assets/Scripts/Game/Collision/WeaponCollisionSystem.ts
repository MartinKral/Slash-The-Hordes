import { Collider2D } from "cc";
import { Enemy } from "../Unit/Enemy/Enemy";
import { Weapon } from "../Unit/Player/Weapon/Weapon";

export class WeaponCollisionSystem {
    private weapon: Weapon;
    public constructor(weapon: Weapon) {
        this.weapon = weapon;
        weapon.Collider.ContactBeginEvent.on(this.onWeaponContactBegin, this);
    }

    private onWeaponContactBegin(otherCollider: Collider2D): void {
        otherCollider.getComponent(Enemy).dealDamage(this.weapon.Damage);
    }
}
