import { Container, Graphics, Loader } from 'pixi.js'
import { ASSETS } from '../assets'
import { APP_HEIGHT, APP_WIDTH } from '../constants'
import gameController from './GameController'

class AssetLoader extends Container {
    private static instance: AssetLoader | undefined = undefined
    private loadProgressionBar: Graphics
    private progressBar: Graphics

    private constructor() {
        super()

        //setup graphics for progression
        const LOAD_BAR_WIDTH = APP_WIDTH * 0.8
        const LOAD_BAR_HEIGHT = 50
        const LOAD_BAR_X = (APP_WIDTH - LOAD_BAR_WIDTH) / 2
        const LOAD_BAR_Y = APP_HEIGHT * 0.7
        const LOAD_BAR_BG_COLOR = 0x0
        const PROGRESS_BAR_COLOR = 0x110b7a

        this.progressBar = new Graphics()
        this.progressBar.beginFill(PROGRESS_BAR_COLOR)
        this.progressBar.drawRect(0, 0, LOAD_BAR_WIDTH, LOAD_BAR_HEIGHT)
        this.progressBar.x = LOAD_BAR_X
        this.progressBar.y = LOAD_BAR_Y
        this.progressBar.endFill()
        this.progressBar.scale.x = 0

        this.addChild(this.progressBar)

        this.loadProgressionBar = new Graphics()
        this.loadProgressionBar.beginFill(LOAD_BAR_BG_COLOR, 0.1)
        this.loadProgressionBar.lineStyle(5, 0x0)

        this.loadProgressionBar.drawRect(0, 0, LOAD_BAR_WIDTH, LOAD_BAR_HEIGHT)
        this.loadProgressionBar.x = LOAD_BAR_X
        this.loadProgressionBar.y = LOAD_BAR_Y
        this.loadProgressionBar.endFill()

        this.addChild(this.loadProgressionBar)

        //loading assets
        Loader.shared.add(ASSETS)

        Loader.shared.onProgress.add(this.loadingProgress, this)
        Loader.shared.onComplete.once(this.loadingCompleted, this)

        Loader.shared.load()
    }

    public static getInstance() {
        if (!AssetLoader.instance) AssetLoader.instance = new AssetLoader()

        return AssetLoader.instance
    }

    private loadingProgress(loader: Loader) {
        const progress = loader.progress / 100
        this.progressBar.scale.x = progress
    }

    private loadingCompleted() {
        this.removeChild(this.loadProgressionBar, this.progressBar)
        gameController.initGameElements()
    }
}

const assetLoader: AssetLoader = AssetLoader.getInstance()
export default assetLoader
