import { Animation, Vec3, _decorator } from "cc";
import { Item } from "./Item";

const { ccclass, property } = _decorator;

@ccclass("XP")
export class XP extends Item {
    @property(Animation) private animation: Animation;

    public setup(position: Vec3): void {
        super.setup(position);
        this.animation.play("DropStart");
    }
}
