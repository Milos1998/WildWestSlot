import { Container, Graphics, Sprite, Texture } from 'pixi.js'
import dataController from '../../logic/DataController'
import { StripeAnimator } from './StripeAnimator'

export default class Stripe extends Container {
    private symbol = ''
    public sprite: Sprite = new Sprite()
    private stripeAnimator: StripeAnimator | null = null

    constructor(x: number, y: number, width: number, height: number, textureSource?: string) {
        super()

        this.x = x
        this.y = y

        this.addChild(this.sprite)
        this.sprite.anchor.set(0.5, 0.5)
        this.sprite.x = width / 2
        this.sprite.y = height / 2
        this.sprite.width = width
        this.sprite.height = height

        this.setSymbol(textureSource)
    }

    private randomSymbolSelection() {
        const stripeSymbols = dataController.getStripeSymbols()
        const symbolNum = Math.floor(Math.random() * stripeSymbols.length)
        return stripeSymbols[symbolNum]
    }

    public setSymbol(textureSource: string | undefined) {
        if (!textureSource) textureSource = this.randomSymbolSelection()

        this.symbol = textureSource
        this.sprite.texture = Texture.from(textureSource)
    }

    public getSymbol() {
        return this.symbol
    }

    public animateSprite(timeline: gsap.core.Timeline, line: Graphics, mask: Graphics) {
        this.stripeAnimator = new StripeAnimator(this, timeline, line, mask)
    }
}
