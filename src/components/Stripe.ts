import { Graphics, Sprite, Texture } from 'pixi.js'
import { STRIPE_FRAME_TO_SYMBOL_RATIO, STRIPE_SIZE } from '../constants/constants'
import dataController from '../logic/DataController'

export default class Stripe extends Sprite {
    private symbol = ''

    constructor(x: number, y: number, width: number, height: number, textureSource = '') {
        super()

        this.anchor.set(0.5, 0.5)
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.setSymbol(textureSource)
    }

    private randomSymbolSelection() {
        const stripeSymbols = dataController.getStripeSymbols()
        const symbolNum = Math.floor(Math.random() * stripeSymbols.length)
        return stripeSymbols[symbolNum]
    }

    public setSymbol(textureSource = '') {
        if (textureSource === '') textureSource = this.randomSymbolSelection()

        this.symbol = textureSource
        this.texture = Texture.from(textureSource)
    }

    public getSymbol() {
        return this.symbol
    }

    public animateSprite(timeline: gsap.core.Timeline, color: number, mask: Graphics) {
        const frame = new Graphics()
        frame.pivot.set(STRIPE_SIZE / 2)
        frame.beginFill(color)
        frame.drawRect(this.x, this.y, STRIPE_SIZE, STRIPE_SIZE)
        frame.endFill()

        frame.beginHole()
        const holeSize = STRIPE_SIZE * STRIPE_FRAME_TO_SYMBOL_RATIO
        const holeXY = (STRIPE_SIZE - holeSize) / 2
        frame.drawRect(this.x + holeXY, this.y + holeXY, holeSize, holeSize)
        frame.endHole()

        frame.alpha = 0
        this.parent.addChild(frame) //memory leak

        mask.beginHole()
        mask.drawRect(this.parent.x, this.y - this.width / 2, this.width, this.height)
        mask.endHole()

        timeline.call(
            () => {
                frame.alpha = 1
            },
            undefined,
            0
        )
        timeline.to(this, { pixi: { scale: 0.9 }, duration: 1, repeat: 1, yoyo: true }, 0)
        timeline.call(
            () => {
                frame.alpha = 0
            },
            undefined,
            timeline.duration()
        )
    }
}
