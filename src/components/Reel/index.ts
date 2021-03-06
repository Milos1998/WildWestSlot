import { gsap } from 'gsap'
import { Container, Sprite, Texture } from 'pixi.js'
import {
    REEL_SPIN_END_ROTATION,
    REEL_SPIN_MID_ROTATION,
    REEL_SPIN_START_ROTATION,
    SOUND_DELAY,
    STRIPES_PER_REEL,
    STRIPE_SIZE
} from '../../constants'
import soundController from '../../logic/SoundController'
import Stripe from '../Stripe'

export default class Reel extends Container {
    private _stripes: Stripe[]
    private forCleanup: Stripe[] = []

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
        this._stripes = []

        for (let i = 0; i < STRIPES_PER_REEL; i++) {
            this._stripes.push(new Stripe(0, this.y + i * STRIPE_SIZE, STRIPE_SIZE, STRIPE_SIZE))
            this.addChild(this._stripes[i])
        }
    }

    public makeAllStripesIdentical(symbol: string) {
        for (const stripe of this._stripes) {
            stripe.symbol = symbol
        }
    }

    private insertStripe(front: boolean) {
        if (front) this.pushFrontStripe()
        else this.pushBackStripe()
    }

    private pushBackStripe(symbol?: string) {
        const last = this._stripes[this._stripes.length - 1]
        const str = new Stripe(last.x, last.y + last.height, last.width, last.height, symbol)
        this._stripes.push(str)
        this.addChild(str)
    }

    private pushFrontStripe(symbol?: string) {
        const first = this._stripes[0]
        const str = new Stripe(first.x, first.y - first.height, first.width, first.height, symbol)
        this._stripes.unshift(str)
        this.addChild(str)
    }

    private trimStripes(front: boolean) {
        if (front) {
            this.forCleanup = [this._stripes.shift() as Stripe]
            this.forCleanup = [...this._stripes.splice(STRIPES_PER_REEL)]
        } else {
            this.forCleanup = [this._stripes.pop() as Stripe]
            this.forCleanup = [...this._stripes.splice(0, this._stripes.length - STRIPES_PER_REEL)]
        }
    }

    public queueReelAnimation(randomDirection: boolean) {
        const reelTimeline = gsap.timeline()

        let direction = 1
        if (randomDirection) direction = Math.random() * 2 - 1
        const midSpinRotations = 40
        const aditionalStripes = STRIPES_PER_REEL + midSpinRotations + STRIPES_PER_REEL + 1
        for (let i = 0; i < aditionalStripes; i++) this.insertStripe(direction > 0)

        reelTimeline
            .to(this._stripes, {
                pixi: {
                    y: `${direction > 0 ? '+' : '-'}=${STRIPES_PER_REEL * STRIPE_SIZE}`
                },
                ease: 'power3.in',
                duration: REEL_SPIN_START_ROTATION
            })
            .to(this._stripes, {
                pixi: {
                    y: `${direction > 0 ? '+' : '-'}=${midSpinRotations * STRIPE_SIZE}`
                },
                duration: REEL_SPIN_MID_ROTATION,
                ease: 'none'
            })
            .to(this._stripes, {
                pixi: {
                    y: `${direction > 0 ? '+' : '-'}=${STRIPES_PER_REEL * STRIPE_SIZE}`
                },
                ease: 'back.out(1.7)',
                duration: REEL_SPIN_END_ROTATION
            })

        reelTimeline.call(
            () => {
                soundController.reelStopping.play()
            },
            undefined,
            reelTimeline.duration() - SOUND_DELAY
        )

        this.trimStripes(direction > 0)

        return reelTimeline
    }

    public animationCleanup() {
        for (const stripe of this.forCleanup) stripe.destroy()
    }

    get symbols() {
        return this._stripes.map((stripe) => stripe.symbol)
    }

    get stripes() {
        return this._stripes
    }

    public dance() {
        const timeline = gsap.timeline()
        this.stripes.forEach((stripe) => timeline.add(stripe.dance(), 0))
        return timeline
    }
}
