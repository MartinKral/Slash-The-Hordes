import { delay } from "../Services/Utils/AsyncUtils";
import { AppRoot } from "./AppRoot";

export async function requireAppRootAsync(): Promise<void> {
    console.log("Waiting for app root");
    while (AppRoot.Instance == null) await delay(10);

    AppRoot.Instance.node.setSiblingIndex(1000); // render on top
    AppRoot.Instance.node.active = false; // forces engine to reorder by hierarchy
    AppRoot.Instance.node.active = true;

    console.log("App root ready");
}
