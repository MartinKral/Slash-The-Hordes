import { _decorator, Component, Node, Prefab, instantiate, randomRangeInt, Vec3 } from "cc";
import { SCREEN_HALF_HEIGHT, SCREEN_HALF_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "../Data/GameConstants";
const { ccclass, property } = _decorator;

@ccclass("Background")
export class Background extends Component {
    @property(Prefab) private backgroundPrefabs: Prefab[] = [];

    private targetNode: Node;
    private instancedBackgrounds: Node[][] = [];

    private rows = 3;
    private columns = 3;
    private nodeSize = 512;

    private playerGridPosX = 0;
    private playerGridPosY = 0;

    public init(targetNode: Node): void {
        this.targetNode = targetNode;

        for (let i = 0; i < this.rows; i++) {
            const rowNodes: Node[] = [];
            for (let u = 0; u < this.columns; u++) {
                const randomIndex = randomRangeInt(0, this.backgroundPrefabs.length);
                const backgroundNode = instantiate(this.backgroundPrefabs[randomIndex]);
                backgroundNode.setParent(this.node);

                const x = u * this.nodeSize - this.nodeSize + SCREEN_HALF_WIDTH;
                const y = i * this.nodeSize - this.nodeSize + SCREEN_HALF_HEIGHT;
                backgroundNode.setWorldPosition(new Vec3(x, y, 0));

                rowNodes.push(backgroundNode);
            }

            this.instancedBackgrounds.push(rowNodes);
        }
    }

    public gameTick(): void {
        this.tryTileX();
        this.tryTileY();
    }

    private tryTileX(): void {
        const playerGridPosX = Math.round((this.targetNode.worldPosition.x - SCREEN_HALF_WIDTH) / this.nodeSize);

        if (playerGridPosX < this.playerGridPosX) {
            // move the last column to the left
            const columnIndex = this.columns - 1;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.x -= this.columns * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);

                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].unshift(instancedNode);
            }
        } else if (this.playerGridPosX < playerGridPosX) {
            // move the first column to the right
            const columnIndex = 0;
            for (let i = 0; i < this.rows; i++) {
                const instancedNode = this.instancedBackgrounds[i][columnIndex];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.x += this.columns * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);

                this.instancedBackgrounds[i].splice(columnIndex, 1);
                this.instancedBackgrounds[i].push(instancedNode);
            }
        }

        this.playerGridPosX = playerGridPosX;
    }

    private tryTileY(): void {
        const playerGridPosY = Math.round((this.targetNode.worldPosition.y - SCREEN_HALF_HEIGHT) / this.nodeSize);

        if (playerGridPosY < this.playerGridPosY) {
            // move the last row down
            const rowIndex = this.rows - 1;
            const nodesInRow: Node[] = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.y -= this.rows * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.unshift(nodesInRow);
        } else if (this.playerGridPosY < playerGridPosY) {
            // move the first row up
            const rowIndex = 0;
            const nodesInRow: Node[] = [];
            for (let i = 0; i < this.columns; i++) {
                const instancedNode = this.instancedBackgrounds[rowIndex][i];
                const newPosition: Vec3 = instancedNode.worldPosition;
                newPosition.y += this.rows * this.nodeSize;

                instancedNode.setWorldPosition(newPosition);
                nodesInRow.push(instancedNode);
            }

            this.instancedBackgrounds.splice(rowIndex, 1);
            this.instancedBackgrounds.push(nodesInRow);
        }

        this.playerGridPosY = playerGridPosY;
    }
}
