// Need to capture *this*
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISignal } from "./ISignal";

export class Signal<T> implements ISignal<T> {
    private handlers: ((data: T) => void)[] = [];
    private thisArgs: any[] = [];

    public on(handler: (data: T) => void, thisArg: any): void {
        this.handlers.push(handler);
        this.thisArgs.push(thisArg);
    }
    public off(handler: (data: T) => void): void {
        const index: number = this.handlers.indexOf(handler);
        this.handlers.splice(index, 1);
        this.thisArgs.splice(index, 1);
    }

    public trigger(data: T): void {
        for (let i = 0; i < this.handlers.length; i++) {
            this.handlers[i].call(this.thisArgs[i], data);
        }
    }
}
