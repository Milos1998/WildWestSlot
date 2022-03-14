import { sound } from '@pixi/sound'
import { Loader } from 'pixi.js'

class SoundController {
    private static _instance: SoundController | undefined = undefined

    static get instance() {
        if (!SoundController._instance) SoundController._instance = new SoundController()
        return SoundController._instance
    }

    public playBackgroundSong() {
        // Loader.shared.resources['background sound'].sound!.volume = 0.03
        // sound.play('background sound')
    }

    public playReelStopping() {
        sound.play('reel stopping')
    }

    public playSpecialsTheme() {
        // sound.play('specials theme')
    }

    playCoinDrop() {
        // sound.play('coin drop long')
    }
}

const soundController: SoundController = SoundController.instance
export default soundController
