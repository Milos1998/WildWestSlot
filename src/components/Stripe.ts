import { Graphics, Sprite, Texture } from 'pixi.js'
import { STRIPE_SIZE } from '../constants/constants'
import dataController from '../logic/DataController'

export default class Stripe extends Sprite {
    private symbol = ''

    constructor(x: number, y: number, width: number, height: number, textureSource = '') {
        super()

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.visible = true

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

    public animateSprite(timeline: gsap.core.Timeline) {
        const frame = new Graphics()
        frame.beginFill(0x0)
        frame.drawRect(0, 0, STRIPE_SIZE, STRIPE_SIZE)
        frame.endFill()
        frame.alpha = 0
        this.addChild(frame)
        timeline.to(
            frame,
            {
                pixi: {
                    alpha: 1
                },
                duration: 1,
                repeat: 1,
                yoyo: true
            },
            0
        )
    }
}
