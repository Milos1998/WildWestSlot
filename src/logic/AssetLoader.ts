import { Container, Graphics, Loader } from 'pixi.js'
import { ASSETS } from '../assets'
import {
    LOAD_BAR_BG_COLOR,
    LOAD_BAR_HEIGHT,
    LOAD_BAR_WIDTH,
    LOAD_BAR_X,
    LOAD_BAR_Y,
    PROGRESS_BAR_COLOR
} from '../constants'
import gameController from './GameController'

class AssetLoader extends Container {
    private static _instance: AssetLoader | undefined = undefined
    private loadProgressionBar: Graphics
    private progressBar: Graphics

    private constructor() {
        super()

        this.loadProgressionBar = new Graphics()
        this.progressBar = new Graphics()
    }

    public initAssetLoader() {
        //setup graphics for progression
        this.progressBar.beginFill(PROGRESS_BAR_COLOR)
        this.progressBar.drawRect(0, 0, LOAD_BAR_WIDTH, LOAD_BAR_HEIGHT)
        this.progressBar.x = LOAD_BAR_X
        this.progressBar.y = LOAD_BAR_Y
        this.progressBar.endFill()
        this.progressBar.scale.x = 0

        this.addChild(this.progressBar)

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

        return this
    }

    static get instance() {
        if (!AssetLoader._instance) AssetLoader._instance = new AssetLoader()

        return AssetLoader._instance
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

const assetLoader: AssetLoader = AssetLoader.instance
export default assetLoader
