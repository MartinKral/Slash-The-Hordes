import { BoxCollider2D, Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component implements IDamageDealing {
    @property(BoxCollider2D) public collider: BoxCollider2D;

    public get Collider(): BoxCollider2D {
        return this.collider;
    }

    public get Damage(): number {
        return 3;
    }
}

export interface IDamageDealing {
    Damage: number;
}
