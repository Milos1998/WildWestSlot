import { gsap } from 'gsap'
import { Container, Sprite, Texture } from 'pixi.js'
import {
    REEL_SPIN_END_ROTATION,
    REEL_SPIN_MID_ROTATION,
    REEL_SPIN_START_ROTATION,
    STRIPES_PER_REEL,
    STRIPE_SIZE
} from '../constants/constants'
import Stripe from './Stripe'

export default class Reel extends Container {
    private stripes: Stripe[]

    constructor(x: number, y: number) {
        super()

        this.x = x
        this.y = y

        const mask = Sprite.from(Texture.WHITE)
        mask.width = STRIPE_SIZE
        mask.height = STRIPE_SIZE * STRIPES_PER_REEL
        this.addChild(mask)
        this.mask = mask

        //init stripe
        this.stripes = []

        for (let i = 0; i < STRIPES_PER_REEL; i++) {
            this.stripes.push(
                new Stripe(0 + STRIPE_SIZE / 2, this.y + i * STRIPE_SIZE + STRIPE_SIZE / 2, STRIPE_SIZE, STRIPE_SIZE)
            )
            this.addChild(this.stripes[i])
        }
    }

    public makeAllStripesIdentical(symbol: string) {
        for (let i = 0; i < this.stripes.length; i++) {
            this.stripes[i].setSymbol(symbol)
        }
    }

    private insertStripe(symbol = '') {
        const first = this.stripes[0]
        const str = new Stripe(first.x, first.y - first.height, first.width, first.height, symbol)
        this.stripes.unshift(str)
        this.addChild(str)
    }

    public spinReel() {
        const reelTimeline = gsap.timeline()

        const midSpinRotations = 40
        const aditionalStripes = STRIPES_PER_REEL + midSpinRotations + STRIPES_PER_REEL + 1
        for (let i = 0; i < aditionalStripes; i++) this.insertStripe()

        reelTimeline
            .to(this.stripes, {
                pixi: {
                    y: `+=${STRIPES_PER_REEL * STRIPE_SIZE}`
                },
                ease: 'power3.in',
                duration: REEL_SPIN_START_ROTATION
            })
            .to(this.stripes, {
                pixi: {
                    y: `+=${midSpinRotations * STRIPE_SIZE}`
                },
                duration: REEL_SPIN_MID_ROTATION,
                ease: 'none'
            })
            .to(this.stripes, {
                pixi: {
                    y: `+=${STRIPES_PER_REEL * STRIPE_SIZE}`
                },
                ease: 'back.out(1.7)',
                duration: REEL_SPIN_END_ROTATION
            })

        this.stripes = this.stripes.slice(1, 4)

        return reelTimeline
    }

    public getSymbols() {
        const syms = []
        for (const stripe of this.stripes) {
            syms.push(stripe.getSymbol())
        }

        return syms
    }

    public getStripes() {
        return this.stripes
    }
}
