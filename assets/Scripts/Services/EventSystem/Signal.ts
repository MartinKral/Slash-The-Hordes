import { ISignal } from "./ISignal";

export class Signal<T> implements ISignal<T> {
    private handlers: ((data: T) => void)[] = [];
    private thisArgs: any[] = [];

    public on(handler: (data: T) => void, thisArg: any): void {
        this.handlers.push(handler);
        this.thisArgs.push(thisArg);
    }
    public off(handler: (data: T) => void): void {
        console.log("[OFF] " + this.handlers.length);
        this.handlers = this.handlers.filter((h) => h !== handler);
        console.log("[OFF] >> " + this.handlers.length);
    }

    public trigger(data: T): void {
        //[...this.handlers].forEach((handler) => handler(data));

        for (let i = 0; i < this.handlers.length; i++) {
            this.handlers[i].call(this.thisArgs[i], data);
        }
    }
}
