class SoundController {
    private static _instance: SoundController | undefined = undefined

    static get instance() {
        if (!SoundController._instance) SoundController._instance = new SoundController()
        return SoundController._instance
    }
}

const soundController: SoundController = SoundController.instance
export default soundController
