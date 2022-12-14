import { _decorator, Component, Node, NodeEventType } from "cc";
import { ISignal } from "../../EventSystem/ISignal";
import { Signal } from "../../EventSystem/Signal";
const { ccclass, property } = _decorator;

@ccclass("UIButton")
export class UIButton extends Component {
    private interactedEvent = new Signal<UIButton>();

    public start(): void {
        this.node.on(Node.EventType.TOUCH_START, this.interact, this);
    }

    public get InteractedEvent(): ISignal<UIButton> {
        return this.interactedEvent;
    }

    private interact(): void {
        console.log("interact");
        this.interactedEvent.trigger(this);
    }
}
