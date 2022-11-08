export interface ISignal<T> {
    on(handler: (data: T) => void, thisArg: any): void;
    off(handler: (data: T) => void): void;
}
