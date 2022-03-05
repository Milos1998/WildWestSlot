import { Graphics, Text, TextStyle } from 'pixi.js'
import Stripe from '..'
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
    private frame: Graphics
    private stripe: Stripe

    constructor(stripe: Stripe, timeline?: gsap.core.Timeline, lineColor?: number, mask?: Graphics) {
        this.frame = new Graphics()
        this.stripe = stripe

        if (mask) this.cropWinLineMask(mask)
        this.makeFrame(lineColor)
        if (timeline) this.animateStripe(timeline)
    }

    private cropWinLineMask(mask: Graphics) {
        mask.beginHole()
        mask.drawRect(this.stripe.parent.x, this.stripe.y, this.stripe.width, this.stripe.height)
        mask.endHole()
    }

    private makeFrame(lineColor?: number) {
        if (!lineColor) lineColor = SPECIAL_SYMBOL_FRAME_COLOR
        this.frame.beginFill(lineColor)
        this.frame.drawRect(0, 0, this.stripe.width, this.stripe.height)
        this.frame.endFill()

        this.frame.beginHole()
        const holeWidth = this.stripe.width * STRIPE_FRAME_TO_SYMBOL_RATIO
        const holeHeight = this.stripe.height * STRIPE_FRAME_TO_SYMBOL_RATIO
        const holeX = (STRIPE_SIZE - holeWidth) / 2
        const holeY = (STRIPE_SIZE - holeHeight) / 2
        this.frame.drawRect(holeX, holeY, holeWidth, holeHeight)
        this.frame.endHole()

        this.frame.alpha = 0
        this.stripe.addChild(this.frame)
    }

    public animateStripe(timeline: gsap.core.Timeline) {
        timeline.call(
            () => {
                this.frame.alpha = 1
            },
            undefined,
            0
        )

        timeline.to(this.stripe.sprite, { pixi: { scale: 0.9 }, duration: 1, repeat: 1, yoyo: true }, 0)

        timeline.call(
            () => {
                this.frame.alpha = 0
            },
            undefined,
            timeline.duration()
        )
    }

    public displayAmount(amount: number) {
        const amountText = new Text((Math.round(amount * 100) / 100).toString(), amountStyle)

        const textBackground = new Graphics()
        textBackground.beginFill(0x0, 0.8)
        textBackground.drawRect(0, 0, this.frame.width * STRIPE_FRAME_TO_SYMBOL_RATIO, amountText.height * 1.5)
        textBackground.endFill()
        textBackground.x = (this.frame.width * (1 - STRIPE_FRAME_TO_SYMBOL_RATIO)) / 2
        textBackground.y =
            this.frame.height - (this.frame.height * (1 - STRIPE_FRAME_TO_SYMBOL_RATIO)) / 2 - textBackground.height
        textBackground.addChild(amountText)

        amountText.x = (textBackground.width - amountText.width) / 2
        amountText.y = (textBackground.height - amountText.height) / 2

        this.frame.addChild(textBackground)
    }

    public shake(timeline: gsap.core.Timeline) {
        timeline.fromTo(
            this.stripe.sprite,
            { duration: 0.1, pixi: { scale: 0.9, rotation: 5 }, ease: 'none' },
            { duration: 0.1, pixi: { scale: 0.9, rotation: -5 }, ease: 'none' },
            0
        )
    }
}
