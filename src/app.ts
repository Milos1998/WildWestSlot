import { Application } from 'pixi.js'
import { APP_BACKGROUND_COLOR, APP_HEIGHT, APP_WIDTH } from './constants'
import gameController from './logic/GameController'

const clickToStart = document.getElementById('click-to-start') as HTMLElement

clickToStart.onclick = () => {
    const app = new Application({
        width: APP_WIDTH,
        height: APP_HEIGHT,
        antialias: true,
        backgroundColor: APP_BACKGROUND_COLOR,
        view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    })

    gameController.initGameController(app)

    clickToStart.style.display = 'none'
}
