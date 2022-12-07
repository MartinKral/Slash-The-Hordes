import { sys } from "cc";
import { UserData } from "../Game/Data/UserData";

export class SaveSystem {
    private userDataIdentifier = "user-data";
    public save(userData: UserData): void {
        sys.localStorage.setItem(this.userDataIdentifier, JSON.stringify(userData));
    }

    public load(): UserData {
        const data: string = sys.localStorage.getItem(this.userDataIdentifier);

        if (!data) return new UserData();

        try {
            return <UserData>JSON.parse(data);
        } catch (error) {
            return new UserData();
        }
    }
}
