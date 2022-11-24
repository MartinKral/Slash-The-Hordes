import { readFileSync, writeFileSync } from "fs";
import { merge } from "lodash";
import { GameSettings } from "../assets/Scripts/Game/Data/GameSettings";

regenerateGameSettings();
function regenerateGameSettings(): void {
    const settingsPath: string = process.argv[2];

    const blankSettings: GameSettings = new GameSettings();
    const savedSettingsJson: string = readFileSync(settingsPath, "utf8");
    const savedSettings: GameSettings = <GameSettings>JSON.parse(savedSettingsJson);

    const result: GameSettings = merge(blankSettings, savedSettings);
    writeFileSync(settingsPath, JSON.stringify(result));

    console.log("Game settings regenerated");
}
