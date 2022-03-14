import { Graphics } from 'pixi.js'
import { APP_HEIGHT, APP_WIDTH, REELS_HOLDER_HEIGHT, reelsHolderWidth, REELS_HOLDER_Y } from '../../constants'
import ReelsHolder from '../ReelsHolder'

export default class BonusSpin extends Graphics {
    public reelsHolder: ReelsHolder

    constructor() {
        super()
        const numOfReels = 3

        this.beginFill(0x0)
        this.drawRect(0, 0, APP_WIDTH, APP_HEIGHT)
        this.endFill()

        this.visible = false

        this.reelsHolder = new ReelsHolder(
            (APP_WIDTH - reelsHolderWidth(numOfReels)) / 2,
            REELS_HOLDER_Y,
            reelsHolderWidth(numOfReels),
            REELS_HOLDER_HEIGHT,
            numOfReels
        )
        this.addChild(this.reelsHolder)
    }
}
