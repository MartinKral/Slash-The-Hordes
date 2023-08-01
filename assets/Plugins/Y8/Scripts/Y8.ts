import { Component, _decorator, CCString} from "cc";
import { Y8API } from "./Y8def";

const { ccclass, property } = _decorator;

@ccclass("Y8")
export class Y8 extends Component {
    @property(CCString) private appId = "ENTER APP ID";

    public init(): Promise<void> {
        return new Promise<void>((resolve) => {
            // callback after Y8 script is loaded
            window.idAsyncInit = (): void => {
                // wait for app connection
                ID.Event.subscribe("id.init", resolve);
                ID.init({ appId: this.appId });
            };

            // Load the script
            (function (d, s, id): void {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                const js: HTMLScriptElement = <HTMLScriptElement>d.createElement(s);
                js.id = id;
                js.src = document.location.protocol == "https:" ? "https://cdn.y8.com/api/sdk.js" : "http://cdn.y8.com/api/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, "script", "id-jssdk");
        });
    }

    public login(): Promise<Y8API.Authorization> {
        console.log("Logging in");
        return new Promise<Y8API.Authorization>((resolve) => {
            ID.login((response: Y8API.Authorization) => {
                resolve(response);
            });
        });
    }

    public async tryAutoLogin(): Promise<void> {
        const auth = await this.getLoginStatus();
        console.log(auth);
        if (auth?.status == "not_linked" || auth?.status == "uncomplete") {
            await this.login();
        }
    }

    public async isLoggedIn(): Promise<boolean> {
        const auth = await this.getLoginStatus();
        return auth?.success == true;
    }

    public sendCustomEvent(name: string, data?: string | number): void {
        ID.Analytics.custom_event(name, data);
    }

    private getLoginStatus(): Promise<Y8API.Authorization> {
        return new Promise((resolve) => {
            ID.getLoginStatus(resolve);
        });
    }
}
