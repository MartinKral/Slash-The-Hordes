import { CCString, _decorator } from "cc";
import { delay } from "../Utils/AsyncUtils";
import { ModalWindow } from "./ModalWindow";
const { ccclass, property } = _decorator;

@ccclass("LevelUpModalWindow")
export class LevelUpModalWindow extends ModalWindow<string, string> {
    @property(CCString) private testField: string;

    protected async setup(params: string): Promise<void> {
        console.log("TEST FIELD: " + this.testField + " params: " + params);

        await delay(10000);
        this.dismiss("FInishedSuccessfuly");
    }
}
