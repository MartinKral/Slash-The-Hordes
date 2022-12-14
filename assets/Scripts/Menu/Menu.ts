import { _decorator, Component, Node, Button } from "cc";
import { UIButton } from "../Services/UI/Button/UIButton";

import { GameRunner } from "./GameRunner";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    @property(UIButton) private playBtn: UIButton;

    public async start(): Promise<void> {
        this.playBtn.InteractedEvent.on(() => GameRunner.Instance.playGame(), this);
    }
}
