import { Graphics, Sprite, Texture } from 'pixi.js'
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
        frame.beginFill(0xffffff)
        frame.drawRect(0, 0, this.width, this.height)
        frame.endFill()
        this.addChild(frame)
        timeline.to(frame, {
            pixi: {
                scale: 0.5
            },
            duration: 2,
            yoyo: true
        })
    }
}
