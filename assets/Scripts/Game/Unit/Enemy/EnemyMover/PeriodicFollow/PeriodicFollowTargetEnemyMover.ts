import { Node, Vec3 } from "cc";
import { Enemy } from "../../Enemy";
import { EnemyMover } from "../EnemyMover";

export class PeriodicFollowTargetEnemyMover extends EnemyMover {
    private enemyToFollowState: Map<Enemy, EnemyFollowState> = new Map<Enemy, EnemyFollowState>();
    private enemyToStateTimeLeft: Map<Enemy, number> = new Map<Enemy, number>();

    public constructor(targetNode: Node, private followTime: number, private waitTime: number) {
        super(targetNode);
    }

    public addEnemy(enemy: Enemy): void {
        this.setEnemyFollowState(enemy, EnemyFollowState.Follow, this.followTime);
        super.addEnemy(enemy);
    }

    public removeEnemy(enemy: Enemy): void {
        super.removeEnemy(enemy);
    }

    public gameTick(deltaTime: number): void {
        for (const enemy of this.enemies) {
            const stateTimeLeft: number = this.enemyToStateTimeLeft.get(enemy) - deltaTime;
            if (stateTimeLeft <= 0) {
                this.switchEnemyFollowState(enemy);
            } else {
                this.enemyToStateTimeLeft.set(enemy, stateTimeLeft);
            }
            if (this.enemyToFollowState.get(enemy) === EnemyFollowState.Follow) {
                let direction: Vec3 = new Vec3();
                direction = Vec3.subtract(direction, this.targetNode.worldPosition, enemy.node.worldPosition);
                enemy.gameTick(direction.normalize(), deltaTime);
            } else if (this.enemyToFollowState.get(enemy) === EnemyFollowState.Wait) {
                enemy.gameTick(new Vec3(), deltaTime);
            }
        }
    }

    private switchEnemyFollowState(enemy: Enemy): void {
        const followState: EnemyFollowState = this.enemyToFollowState.get(enemy);
        if (followState === EnemyFollowState.Follow) {
            this.setEnemyFollowState(enemy, EnemyFollowState.Wait, this.waitTime);
        } else if (followState === EnemyFollowState.Wait) {
            this.setEnemyFollowState(enemy, EnemyFollowState.Follow, this.followTime);
        }
    }

    private setEnemyFollowState(enemy: Enemy, followState: EnemyFollowState, stateTimeLeft: number): void {
        this.enemyToFollowState.set(enemy, followState);
        this.enemyToStateTimeLeft.set(enemy, stateTimeLeft);
    }
}

export enum EnemyFollowState {
    Follow,
    Wait
}
