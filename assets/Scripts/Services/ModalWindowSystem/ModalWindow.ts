import { Animation, Component, _decorator } from "cc";
import { UIButton } from "../UI/Button/UIButton";
import { delay } from "../Utils/AsyncUtils";

const { property } = _decorator;

export abstract class ModalWindow<TParam, TResult> extends Component {
    @property(Animation) private animation: Animation;
    @property(UIButton) private closeButton: UIButton;
    @property(UIButton) private backgroundCloseButton: UIButton;

    private result: TResult;
    private isDismissed = false;

    public async runAsync(params?: TParam): Promise<TResult> {
        this.closeButton?.InteractedEvent.on(() => this.dismiss(), this);
        this.backgroundCloseButton?.InteractedEvent.on(() => this.dismiss(), this);

        this.setup(params);
        this.animation?.play("open");
        while (!this.isDismissed) await delay(100);
        this.animation?.play("close");

        await delay(500);
        return this.result;
    }

    protected abstract setup(params?: TParam): void;

    protected dismiss(result?: TResult): void {
        this.result = result;
        this.isDismissed = true;
    }
}
