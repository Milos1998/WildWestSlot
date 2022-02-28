import { Graphics } from 'pixi.js'
import Stripe from '..'
import { STRIPE_SIZE, STRIPE_FRAME_TO_SYMBOL_RATIO } from '../../../constants'

export class StripeAnimator {
    private frame: Graphics
    private stripe: Stripe

    constructor(stripe: Stripe, timeline: gsap.core.Timeline, line: Graphics, mask: Graphics) {
        this.frame = new Graphics()
        this.stripe = stripe

        this.cropLineMask(mask)
        this.makeFrame(line)

        this.animateStripe(timeline)
    }

    private cropLineMask(mask: Graphics) {
        mask.beginHole()
        mask.drawRect(this.stripe.parent.x, this.stripe.y, this.stripe.width, this.stripe.height)
        mask.endHole()
    }

    private makeFrame(line: Graphics) {
        this.frame.beginFill(line.line.color)
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
}
