import { Sprite, Texture } from 'pixi.js'
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
}
