import { Slider, _decorator } from "cc";
import { AppRoot } from "../../../AppRoot/AppRoot";
import { ModalWindow } from "../../../Services/ModalWindowSystem/ModalWindow";
import { UIButton } from "../../../Services/UI/Button/UIButton";
import { Empty } from "../Upgrades/UpgradesModalWindow";

const { ccclass, property } = _decorator;

@ccclass("AudioSettingsModalWindow")
export class AudioSettingsModalWindow extends ModalWindow<Empty, Empty> {
    @property(Slider) private soundVolumeSlider: Slider;
    @property(Slider) private musicVolumeSlider: Slider;
    @property(UIButton) private okButton: UIButton;

    protected setup(): void {
        this.soundVolumeSlider.progress = AppRoot.Instance.AudioPlayer.SoundVolume;
        this.musicVolumeSlider.progress = AppRoot.Instance.AudioPlayer.MusicVolume;

        this.soundVolumeSlider.node.on("slide", this.updateSoundVolume, this);
        this.musicVolumeSlider.node.on("slide", this.updateMusicVolume, this);

        this.okButton.InteractedEvent.on(this.dismiss, this);
    }

    private updateSoundVolume(): void {
        AppRoot.Instance.AudioPlayer.setSoundVolume(this.soundVolumeSlider.progress);
    }

    private updateMusicVolume(): void {
        AppRoot.Instance.AudioPlayer.setMusicVolume(this.musicVolumeSlider.progress);
    }

    protected dismiss(result?: Empty): void {
        super.dismiss(result);
        const userData = AppRoot.Instance.LiveUserData;
        userData.musicVolume = this.musicVolumeSlider.progress;
        userData.soundVolume = this.soundVolumeSlider.progress;
        AppRoot.Instance.saveUserData();
    }
}
