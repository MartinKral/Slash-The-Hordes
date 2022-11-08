import { ISignal } from "./ISignal";

export class Signal<T> implements ISignal<T> {
    private handlers: ((data: T) => void)[] = [];

    public on(handler: (data: T) => void): void {
        this.handlers.push(handler);
    }
    public off(handler: (data: T) => void): void {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    public trigger(data: T): void {
        [...this.handlers].forEach((handler) => handler(data));
    }
}
