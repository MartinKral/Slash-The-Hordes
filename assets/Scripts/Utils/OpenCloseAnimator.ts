import { Animation, Component, _decorator } from "cc";
import { delay } from "../Services/Utils/AsyncUtils";
const { ccclass, property } = _decorator;

@ccclass("OpenCloseAnimator")
export class OpenCloseAnimator extends Component {
    @property(Animation) private animation: Animation;

    private readonly openStateName = "Open";
    private readonly closeStateName = "Close";

    private openDuration = 0;
    private closeDuration = 0;

    public init(): void {
        this.openDuration = this.animation.getState(this.openStateName).duration;
        this.closeDuration = this.animation.getState(this.closeStateName).duration;
    }

    public async playOpen(): Promise<void> {
        this.node.active = true;
        this.animation.play(this.openStateName);
        await delay(this.openDuration * 1000);
    }

    public async playClose(): Promise<void> {
        this.node.active = true;
        this.animation.play(this.closeStateName);
        await delay(this.closeDuration * 1000);
        this.node.active = false;
    }
}
