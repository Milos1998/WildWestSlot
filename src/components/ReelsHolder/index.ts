import gsap from 'gsap/all'
import { Container, Graphics } from 'pixi.js'
import {
    REELS_HOLDER_FRAME_THICKNESS,
    REELS_PER_REEL_HOLDER,
    REEL_SPIN_DELAY,
    REEL_SPIN_MID_ROTATION,
    REEL_SPIN_START_ROTATION,
    STRIPE_SIZE
} from '../../constants'
import dataController from '../../logic/DataController'
import Reel from '../Reel'

export default class ReelsHolder extends Container {
    private reels: Reel[]
    private mainTimeline: gsap.core.Timeline

    constructor(x: number, y: number, width: number, height: number, numOfReels: number) {
        super()

        if (numOfReels < 2 || numOfReels > REELS_PER_REEL_HOLDER) throw new Error('number of reels out of range')

        this.x = x
        this.y = y

        //frame
        const frame = new Graphics()
        frame.beginFill(0x0)
        frame.drawRect(-REELS_HOLDER_FRAME_THICKNESS, -REELS_HOLDER_FRAME_THICKNESS, width, height)
        frame.endFill()
        this.addChild(frame)

        this.reels = []
        for (let i = 0; i < numOfReels; i++) {
            this.reels.push(new Reel(i * (STRIPE_SIZE + REELS_HOLDER_FRAME_THICKNESS), 0))
            this.addChild(this.reels[i])
        }

        this.makeReelsPretty()

        this.mainTimeline = gsap.timeline()
    }

    get numOfReels() {
        return this.reels.length
    }

    private makeReelsPretty() {
        const symbols = dataController.getStripeSymbols()
        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].makeAllStripesIdentical(symbols[i])
        }
    }

    public async spinReels(onReelsStopping: () => void) {
        this.queueSpinReelsAnimation()

        this.mainTimeline.call(onReelsStopping, undefined, 'reelsStopping')

        return this.mainTimeline.play('spinReels').then(() => {
            this.resetMainTimeline()
            this.animationCleanup()
        })
    }

    public slamStopAnimation() {
        this.mainTimeline.seek('reelsStopping', false)
    }

    private queueSpinReelsAnimation() {
        this.mainTimeline.addLabel('spinReels')

        for (let i = 0; i < this.reels.length; i++) {
            this.mainTimeline.add(this.reels[i].queueReelAnimation(), `${i * REEL_SPIN_DELAY}`)
        }

        this.mainTimeline.addLabel('reelsStopping', REEL_SPIN_START_ROTATION + REEL_SPIN_MID_ROTATION)
        this.mainTimeline.pause()
    }

    private resetMainTimeline() {
        this.mainTimeline.kill()
        this.mainTimeline = gsap.timeline()
    }

    private animationCleanup() {
        this.reels.forEach((reel) => reel.animationCleanup())
    }

    get symbolsCombination() {
        return this.reels.map((reel) => reel.symbols)
    }

    get stripes() {
        return this.reels.map((reel) => reel.stripes)
    }

    public async dance() {
        this.reels.forEach((reel) => this.mainTimeline.add(reel.dance(), 0))
        this.mainTimeline.repeat(-1)
        this.mainTimeline.yoyo(true)
        return this.mainTimeline.play().then(() => {
            this.resetMainTimeline()
        })
    }
}
