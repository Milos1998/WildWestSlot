import { Graphics, Sprite, Text, TextStyle } from 'pixi.js'
import Stripe from '..'
import { gsap } from 'gsap'
import {
    STRIPE_SIZE,
    STRIPE_FRAME_TO_SYMBOL_RATIO,
    SPECIAL_SYMBOL_FRAME_COLOR,
    DISPLAYS_FONT_FAMILY,
    DISPLAYS_FONT_FILL
} from '../../../constants'

const amountStyle = new TextStyle({
    fill: DISPLAYS_FONT_FILL,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 20
})

export class StripeAnimator {
    private stripe: Stripe
    private timeline: gsap.core.Timeline

    constructor(stripe: Stripe) {
        this.stripe = stripe
        this.timeline = gsap.timeline()
    }

    public winAnimation(frameColor?: number, mask?: Graphics, displayAmount?: number) {
        if (mask) this.cropWinLineMask(mask)
        const frame = this.makeFrame(frameColor, displayAmount)

        return this.timeline
            .call(
                () => {
                    frame.alpha = 1
                },
                undefined,
                0
            )
            .to(this.stripe.sprite, { pixi: { scale: 0.9 }, duration: 1, repeat: 1, yoyo: true }, 0)
            .call(
                () => {
                    frame.alpha = 0
                },
                undefined,
                this.timeline.duration()
            )
    }

    private cropWinLineMask(mask: Graphics) {
        mask.beginHole()
        mask.drawRect(this.stripe.parent.x, this.stripe.y, this.stripe.width, this.stripe.height)
        mask.endHole()
    }

    private makeFrame(frameColor?: number, displayAmount?: number) {
        if (!frameColor) frameColor = SPECIAL_SYMBOL_FRAME_COLOR
        const frame = new Graphics()
        frame.beginFill(frameColor)
        frame.drawRect(0, 0, this.stripe.width, this.stripe.height)
        frame.endFill()

        frame.beginHole()
        const holeWidth = this.stripe.width * STRIPE_FRAME_TO_SYMBOL_RATIO
        const holeHeight = this.stripe.height * STRIPE_FRAME_TO_SYMBOL_RATIO
        const holeX = (STRIPE_SIZE - holeWidth) / 2
        const holeY = (STRIPE_SIZE - holeHeight) / 2
        frame.drawRect(holeX, holeY, holeWidth, holeHeight)
        frame.endHole()

        frame.alpha = 0
        this.stripe.addChild(frame)
        if (displayAmount) this.displayAmount(displayAmount, frame)
        return frame
    }

    private displayAmount(amount: number, frame: Graphics) {
        const amountText = new Text((Math.round(amount * 100) / 100).toString(), amountStyle)

        const textBackground = new Graphics()
        textBackground.addChild(amountText)
        textBackground.beginFill(0x0, 0.8)
        textBackground.drawRect(0, 0, frame.width * STRIPE_FRAME_TO_SYMBOL_RATIO, amountText.height * 1.5)
        textBackground.endFill()
        textBackground.x = (frame.width * (1 - STRIPE_FRAME_TO_SYMBOL_RATIO)) / 2
        textBackground.y =
            frame.height - (frame.height * (1 - STRIPE_FRAME_TO_SYMBOL_RATIO)) / 2 - textBackground.height

        amountText.x = (textBackground.width - amountText.width) / 2
        amountText.y = (textBackground.height - amountText.height) / 2

        frame.addChild(textBackground)
    }

    public dance() {
        return this.timeline.fromTo(
            this.stripe.sprite,
            { duration: 0.1, pixi: { scale: 0.9, rotation: 5 }, ease: 'none' },
            { duration: 0.1, pixi: { scale: 0.9, rotation: -5 }, ease: 'none' },
            0
        )
    }

    public bonusAnimation() {
        const bonusSign = Sprite.from('bonus sign')
        bonusSign.scale.set(0.1)
        this.stripe.addChild(bonusSign)
        bonusSign.alpha = 0

        this.timeline
    }
}
