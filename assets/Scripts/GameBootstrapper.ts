import { Component, _decorator } from "cc";
import { Player } from "./Player";
import { VirtualJoystic } from "./VirtualJoystic";
const { ccclass, property } = _decorator;

@ccclass("GameBootstrapper")
export class GameBootstrapper extends Component {
    @property(VirtualJoystic) private virtualJoystic: VirtualJoystic;
    @property(Player) private player: Player;
    @property(Number) private strikeDelay = 0;

    public start(): void {
        this.virtualJoystic.init();
        this.player.init(this.virtualJoystic, this.strikeDelay);
    }

    public update(deltaTime: number): void {
        this.player.gameTick(deltaTime);
    }
}
