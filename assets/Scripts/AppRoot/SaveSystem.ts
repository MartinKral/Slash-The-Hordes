import { sys } from "cc";
import { UserData } from "../Game/Data/UserData";

export class SaveSystem {
    private userDataIdentifier = "user-dse";
    public save(userData: UserData): void {
        sys.localStorage.setItem(this.userDataIdentifier, JSON.stringify(userData));
    }

    public load(): UserData {
        const data: string = sys.localStorage.getItem(this.userDataIdentifier);

        if (!data) return new UserData();

        try {
            // TODO: the data can be corrupted if we introduce a new field in UserData
            return <UserData>JSON.parse(data);
        } catch (error) {
            return new UserData();
        }
    }
}
