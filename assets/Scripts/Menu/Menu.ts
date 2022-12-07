import { _decorator, Component, Node } from "cc";
import { GameRunner } from "./GameRunner";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
    public start(): void {
        GameRunner.Instance.playGame();
    }
}
