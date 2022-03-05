import { Container, Graphics, Sprite, Texture } from 'pixi.js'
import dataController from '../../logic/DataController'
import { StripeAnimator } from './StripeAnimator'

export default class Stripe extends Container {
    private _symbol = ''
    public sprite: Sprite = new Sprite()
    public stripeAnimator: StripeAnimator | null = null

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

        this.symbol = textureSource
    }

    private randomSymbolSelection() {
        const stripeSymbols = dataController.getStripeSymbols()
        const symbolNum = Math.floor(Math.random() * stripeSymbols.length)
        return stripeSymbols[symbolNum]
    }

    set symbol(textureSource: string | undefined) {
        if (!textureSource) textureSource = this.randomSymbolSelection()

        this._symbol = textureSource
        this.sprite.texture = Texture.from(textureSource)
    }

    get symbol(): string {
        return this._symbol
    }

    public animateSprite(timeline: gsap.core.Timeline, lineColor?: number, mask?: Graphics) {
        this.stripeAnimator = new StripeAnimator(this, timeline, lineColor, mask)
    }

    public displayAmount(amount: number) {
        this.stripeAnimator?.displayAmount(amount)
    }

    public dance(timeline: gsap.core.Timeline) {
        this.stripeAnimator = new StripeAnimator(this)
        this.stripeAnimator.shake(timeline)
    }
}
