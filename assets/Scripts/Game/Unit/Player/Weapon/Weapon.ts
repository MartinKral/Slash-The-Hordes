import { Animation, AnimationState, Component, _decorator } from "cc";
import { GameTimer } from "../../../../Services/GameTimer";
import { WeaponSettings } from "../../../Data/GameSettings";

import { UpgradableCollider } from "./UpgradableCollider";
const { ccclass, property } = _decorator;

@ccclass("Weapon")
export class Weapon extends Component {
    @property(Animation) private weaponAnimation: Animation;
    @property(UpgradableCollider) private upgradableCollider: UpgradableCollider;

    private strikeTimer: GameTimer;
    private strikeState: AnimationState;
    private damage: number;

    public init(settings: WeaponSettings): void {
        this.strikeTimer = new GameTimer(settings.strikeDelay);
        this.damage = settings.damage;
        this.node.active = false;

        this.weaponAnimation.on(Animation.EventType.FINISHED, this.endStrike, this);
        this.strikeState = this.weaponAnimation.getState(this.weaponAnimation.clips[0].name);
        this.strikeState.speed = 1;

        this.upgradableCollider.init();
    }

    public gameTick(deltaTime: number): void {
        this.strikeTimer.gameTick(deltaTime);
        if (this.strikeTimer.tryFinishPeriod()) {
            this.strike();
        }
    }

    public get Collider(): UpgradableCollider {
        return this.upgradableCollider;
    }

    public get Damage(): number {
        return this.damage;
    }

    public upgradeWeaponDamage(): void {
        this.damage++;
    }
    public upgradeWeaponLength(): void {
        this.upgradableCollider.upgrade();
    }

    private strike(): void {
        this.node.active = true;
        this.weaponAnimation.play(this.strikeState.name);
    }

    private endStrike(): void {
        this.node.active = false;
    }
}
