import { Container, Graphics } from 'pixi.js'
import {
    REELS_HOLDER_FRAME_THICKNESS,
    REELS_PER_REEL_HOLDER,
    REEL_SPIN_DELAY,
    REEL_SPIN_MID_ROTATION,
    REEL_SPIN_START_ROTATION,
    STRIPE_SIZE
} from '../constants/constants'
import dataController from '../logic/DataController'
import Reel from './Reel'

export default class ReelsHolder extends Container {
    private reels: Reel[]

    constructor(x: number, y: number, width: number, height: number) {
        super()

        this.x = x
        this.y = y

        //frame
        const frame = new Graphics()
        frame.beginFill(0x0)
        frame.drawRect(-REELS_HOLDER_FRAME_THICKNESS, -REELS_HOLDER_FRAME_THICKNESS, width, height)
        frame.endFill()
        this.addChild(frame)

        this.reels = []
        for (let i = 0; i < REELS_PER_REEL_HOLDER; i++) {
            this.reels.push(new Reel(i * (STRIPE_SIZE + REELS_HOLDER_FRAME_THICKNESS), 0))
            this.addChild(this.reels[i])
        }

        this.makeReelsPretty()
    }

    private makeReelsPretty() {
        const symbols = dataController.getStripeSymbols()
        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].makeAllStripesIdentical(symbols[i])
        }
    }

    public async spinReels(onReelsStopping: () => void) {
        this.queueSpinReelsAnimation()

        dataController.animationSequencer.call(onReelsStopping, undefined, 'reelsStopping')
        return dataController.animationSequencer.play('spinReels').then(() => {
            dataController.animationSequencer.clear()
        })
    }

    public slamStopAnimation() {
        dataController.animationSequencer.seek('reelsStopping', false)
    }

    private queueSpinReelsAnimation() {
        dataController.animationSequencer.addLabel('spinReels')

        for (let i = 0; i < this.reels.length; i++) {
            dataController.animationSequencer.add(this.reels[i].spinReel(), `<${REEL_SPIN_DELAY}`)
        }

        dataController.animationSequencer.addLabel('reelsStopping', REEL_SPIN_START_ROTATION + REEL_SPIN_MID_ROTATION)
        dataController.animationSequencer.pause()
        dataController.setSymbolCombination(this.getSymbolsCombination())
    }

    private getSymbolsCombination() {
        const symCombination = []
        for (let i = 0; i < this.reels.length; i++) {
            symCombination.push(this.reels[i].getSymbols())
        }

        return symCombination
    }

    public getStripes() {
        return this.reels.map((reel) => reel.getStripes())
    }
}
