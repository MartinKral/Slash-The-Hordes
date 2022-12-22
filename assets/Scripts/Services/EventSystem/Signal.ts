// Need to capture *this*
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISignal } from "./ISignal";

export class Signal<T = void> implements ISignal<T> {
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
        // protect from trigger >> off
        const handlers: ((data: T) => void)[] = [...this.handlers];
        const thisArgs: any[] = [...this.thisArgs];

        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(thisArgs[i], data);
        }
    }
}
