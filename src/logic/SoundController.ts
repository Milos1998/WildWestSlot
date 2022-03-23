import { sound, Sound } from '@pixi/sound'

class SoundController {
    private static _instance: SoundController | undefined = undefined
    public backgroundSong!: Sound
    public reelStopping!: Sound
    public bonusLevelSong!: Sound
    public collectSound!: Sound
    public spinSound!: Sound
    public eagle!: Sound
    public gunShot!: Sound

    static get instance() {
        if (!SoundController._instance) SoundController._instance = new SoundController()
        return SoundController._instance
    }

    public initController() {
        this.backgroundSong = sound.find('background song').pause()
        this.backgroundSong.loop = true
        this.backgroundSong.volume = 0.1
        this.reelStopping = sound.find('reel stopping').pause()
        this.bonusLevelSong = sound.find('bonus level song').pause()
        this.bonusLevelSong.loop = true
        this.bonusLevelSong.volume = 0.4
        this.collectSound = sound.find('collect money').pause()
        this.collectSound.volume = 0.1
        this.spinSound = sound.find('spin lever').pause()
        this.spinSound.volume = 0.15
        this.eagle = sound.find('eagle').pause()
        this.gunShot = sound.find('gun shot').pause()
    }
}

const soundController: SoundController = SoundController.instance
export default soundController
