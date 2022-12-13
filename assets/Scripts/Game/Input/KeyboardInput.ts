import { EventKeyboard, Input, input, KeyCode, Vec2 } from "cc";
import { IInput } from "./IInput";

export class KeyboardInput implements IInput {
    private xAxis = 0;
    private yAxis = 0;

    private up: KeyCode;
    private down: KeyCode;
    private left: KeyCode;
    private right: KeyCode;

    public constructor(up: KeyCode, down: KeyCode, left: KeyCode, right: KeyCode) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    public getAxis(): Vec2 {
        return new Vec2(this.xAxis, this.yAxis).normalize();
    }

    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case this.up:
                this.yAxis = 1;
                break;
            case this.down:
                this.yAxis = -1;
                break;
            case this.left:
                this.xAxis = -1;
                break;
            case this.right:
                this.xAxis = 1;
                break;
        }
    }

    private onKeyUp(event: EventKeyboard): void {
        switch (event.keyCode) {
            case this.up:
                this.yAxis = this.yAxis === 1 ? 0 : this.yAxis;
                break;
            case this.down:
                this.yAxis = this.yAxis === -1 ? 0 : this.yAxis;
                break;
            case this.left:
                this.xAxis = this.xAxis === -1 ? 0 : this.xAxis;
                break;
            case this.right:
                this.xAxis = this.xAxis === 1 ? 0 : this.xAxis;
                break;
        }
    }
}
