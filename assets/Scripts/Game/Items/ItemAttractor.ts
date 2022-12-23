import { Node, Vec3 } from "cc";
import { getDirection } from "../../Services/Utils/VecUtils";
import { Item } from "./Item";

export class ItemAttractor {
    private items: Item[] = [];
    private speedValues: number[] = [];

    public constructor(private playerNode: Node, private speedIncreasePerSecond: number) {}

    public gameTick(deltaTime: number): void {
        for (let i = 0; i < this.items.length; i++) {
            const direction: Vec3 = getDirection(this.playerNode.worldPosition, this.items[i].node.worldPosition);
            const position = this.items[i].node.worldPosition.clone();
            position.x += direction.x * this.speedValues[i] * deltaTime;
            position.y += direction.y * this.speedValues[i] * deltaTime;

            this.items[i].node.setWorldPosition(position);
            this.speedValues[i] += this.speedIncreasePerSecond * deltaTime;
        }
    }

    public addItem(item: Item): void {
        if (this.items.includes(item)) return;

        item.PickupEvent.on(this.removeItem, this);

        this.items.push(item);
        this.speedValues.push(0);
    }

    private removeItem(item: Item): void {
        item.PickupEvent.off(this.removeItem);

        const index = this.items.indexOf(item);

        this.items.splice(index, 1);
        this.speedValues.splice(index, 1);
    }
}
