import { Collider2D, Contact2DType } from "cc";
import { Enemy } from "../Enemy/Enemy";
import { Weapon } from "../Weapon";

export class WeaponCollisionSystem {
    private weapon: Weapon;
    public constructor(weapon: Weapon) {
        this.weapon = weapon;
        weapon.Collider.on(Contact2DType.BEGIN_CONTACT, this.onWeaponContactBegin, this);
    }

    private onWeaponContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        otherCollider.getComponent(Enemy).dealDamage(this.weapon.Damage);
    }
}
