import { _decorator, Component, Animation, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("EnemyDeathEffect")
export class EnemyDeathEffect extends Component {
    @property(Animation) private animation: Animation;

    public setup(worldPosition: Vec3): void {
        this.node.setWorldPosition(worldPosition);
        this.node.active = true;

        this.animation.play("DeathEffect");
    }
}
