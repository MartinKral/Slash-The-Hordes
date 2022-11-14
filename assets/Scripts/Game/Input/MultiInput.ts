import { Vec2 } from "cc";
import { IInput } from "./IInput";

export class MultiInput implements IInput {
    private inputs: IInput[];

    public constructor(inputs: IInput[]) {
        this.inputs = inputs;
    }

    public getAxis(): Vec2 {
        for (let i = 0; i < this.inputs.length; i++) {
            if (!this.inputs[i].getAxis().equals(Vec2.ZERO)) {
                return this.inputs[i].getAxis();
            }
        }

        return new Vec2();
    }
}
