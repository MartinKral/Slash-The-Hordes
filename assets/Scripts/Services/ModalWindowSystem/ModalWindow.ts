import { Component } from "cc";
import { delay } from "../Utils/AsyncUtils";

export abstract class ModalWindow<TParam, TResult> extends Component {
    private result: TResult;
    private isDismissed = false;

    public async runAsync(params?: TParam): Promise<TResult> {
        this.setup(params);
        while (!this.isDismissed) await delay(100);

        return this.result;
    }

    protected abstract setup(params?: TParam): void;

    protected dismiss(result?: TResult): void {
        this.result = result;
        this.isDismissed = true;
    }
}
