import { Graphics, Sprite } from 'pixi.js'
import {
    APP_HEIGHT,
    APP_WIDTH,
    MODAL_FILTER_ITEM_SCALE,
    MODAL_FILTER_PADDING,
    MODAL_FILTER_ROWS,
    MODAL_FILTER_X,
    MODAL_FILTER_Y
} from '../../constants'
import dataController from '../../logic/DataController'

export class Modal extends Graphics {
    private filter: Graphics
    private filtered: string[] = []
    private toFilter = ''

    constructor() {
        super()

        this.beginFill(0.0, 0.8)
        this.drawRect(0, 0, APP_WIDTH, APP_HEIGHT)
        this.endFill()

        this.visible = true
        this.interactive = true

        this.filter = new Graphics()
        this.addChild(this.filter)
        dataController.getStripeSymbols(false).forEach((sym, ind) => {
            const sprite = Sprite.from(sym)
            this.filter.addChild(sprite)
            sprite.scale.set(MODAL_FILTER_ITEM_SCALE)
            sprite.y = MODAL_FILTER_Y + Math.floor(ind / MODAL_FILTER_ROWS) * (sprite.height + MODAL_FILTER_PADDING)
            sprite.x = MODAL_FILTER_X + (ind % MODAL_FILTER_ROWS) * (sprite.width + MODAL_FILTER_PADDING)
            sprite.on('pointertap', () => {
                if (this.toFilter === sym) this.toFilter = '' //sredi ovo
                sprite.tint = 0x0
                this.toFilter = sym
            })
        })
    }
}
