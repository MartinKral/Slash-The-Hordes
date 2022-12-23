import { Collider2D, Contact2DType } from "cc";
import { Item } from "../Items/Item";
import { ItemAttractor } from "../Items/ItemAttractor";
import { Magnet } from "../Unit/Player/Magnet";

export class MagnetCollisionSystem {
    public constructor(magnet: Magnet, private itemAttractor: ItemAttractor) {
        magnet.Collider.on(Contact2DType.BEGIN_CONTACT, this.onMagnetContactBegin, this);
    }

    private onMagnetContactBegin(_selfCollider: Collider2D, otherCollider: Collider2D): void {
        this.itemAttractor.addItem(otherCollider.getComponent(Item));
    }
}
