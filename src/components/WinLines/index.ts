import { Container, Graphics } from 'pixi.js'
import { REELS_HOLDER_FRAME_THICKNESS, REELS_PER_REEL_HOLDER, STRIPE_SIZE, WIN_LINE_THICKNESS } from '../../constants'
import { LINE_COLORS, LINE_OFFSETS, WIN_LINES_DATA } from '../../constants/winLinesData'
import dataController from '../../logic/DataController'
import { Symbols } from '../../constants/winLinesData'
import gsap from 'gsap'
import Stripe from '../Stripe'
import { sound } from '@pixi/sound'

export default class WinLines extends Container {
    private lines: Graphics[] = []
    private myWidth = 0
    private myHeight = 0
    private masterTimeline: gsap.core.Timeline | undefined = undefined

    constructor(x: number, y: number, width: number, height: number) {
        super()

        this.x = x - REELS_HOLDER_FRAME_THICKNESS
        this.y = y
        this.myWidth = width
        this.myHeight = height

        for (const wld of WIN_LINES_DATA) {
            const line = new Graphics()
            this.lines.push(line)
            this.addChild(line)
            line.lineStyle(WIN_LINE_THICKNESS, LINE_COLORS[wld.lineGroup])

            const offsetY = STRIPE_SIZE / 2 + LINE_OFFSETS[wld.lineGroup]
            let offsetX = STRIPE_SIZE / 2 + REELS_HOLDER_FRAME_THICKNESS
            line.moveTo(0, wld.winPositions[0] * STRIPE_SIZE + offsetY)
            let j
            for (j = 0; j < REELS_PER_REEL_HOLDER; j++) {
                offsetX += REELS_HOLDER_FRAME_THICKNESS
                line.lineTo(j * STRIPE_SIZE + offsetX, wld.winPositions[j] * STRIPE_SIZE + offsetY)
            }
            j--
            line.lineTo(j * STRIPE_SIZE + offsetX + (1 / 2) * STRIPE_SIZE, wld.winPositions[j] * STRIPE_SIZE + offsetY)
        }

        this.hideAllLines()
    }

    public displayOnlySelectedLines() {
        const numSelectedLines = dataController.numberOfLines
        for (let i = 0; i < this.lines.length; i++)
            if (i < numSelectedLines) this.lines[i].visible = true
            else this.lines[i].visible = false
    }

    public displayAllLines() {
        for (let i = 0; i < this.lines.length; i++) this.lines[i].visible = true
    }

    public hideAllLines() {
        for (let i = 0; i < this.lines.length; i++) this.lines[i].visible = false
    }

    public stopWinningLinesAnimation() {
        dataController.animationSequencer.repeat(0)
        dataController.animationSequencer.seek('endAnimateWinSymbols', false)
    }

    public queueWinningLinesAnimation(stripes: Stripe[][]) {
        const wins = [...dataController.wins].sort((w1, w2) => w2.winAmount - w1.winAmount)

        this.masterTimeline = gsap.timeline()

        for (const win of wins) {
            const timeline = gsap.timeline()
            this.masterTimeline.add(timeline)

            if (win.winSymbol === Symbols.Reward1000) {
                this.queueSpecialsAnimation(timeline, win.winAmount, stripes)
                continue
            }

            const mask = new Graphics()
            mask.x = REELS_HOLDER_FRAME_THICKNESS
            mask.beginFill(0x0, 1)
            mask.drawRect(0, 0, this.myWidth, this.myHeight)
            mask.endFill()

            this.toggleMaskVisibility(true, timeline, this.lines[win.winLine], mask, 0)

            //get all the symbols that are part of winning line and animate them on same timeline.
            for (let reelNum = 0; reelNum <= win.numberOfMatches; reelNum++) {
                const positionOnReel = WIN_LINES_DATA[win.winLine].winPositions[reelNum]
                stripes[reelNum][positionOnReel].animateSprite(timeline, this.lines[win.winLine].line.color, mask)
                if (reelNum === win.numberOfMatches) stripes[reelNum][positionOnReel].displayAmount(win.winAmount)
            }

            this.toggleMaskVisibility(false, timeline, this.lines[win.winLine], mask, timeline.duration())
        }

        this.masterTimeline.repeat(-1)

        return this.masterTimeline
    }

    private queueSpecialsAnimation(timeline: gsap.core.Timeline, winAmount: number, stripes: Stripe[][]) {
        for (const reel of stripes) {
            for (const stripe of reel) {
                if (stripe.symbol === Symbols.Reward1000) {
                    stripe.animateSprite(timeline)
                    stripe.displayAmount(winAmount)
                }
            }
        }

        timeline.call(
            () => {
                sound.play('specials theme') //TODO
            },
            undefined,
            0
        )
    }

    private toggleMaskVisibility(
        visible: boolean,
        timeline: gsap.core.Timeline,
        line: Graphics,
        mask: Graphics,
        toggleAt: number
    ) {
        let toggleFunction: (line: Graphics, mask: Graphics) => void
        if (visible) {
            toggleFunction = (line, mask) => {
                line.visible = true
                line.mask = mask
                line.addChild(mask)
            }
        } else {
            toggleFunction = (line, mask) => {
                line.visible = false
                line.mask = null
                line.removeChild(mask)
            }
        }

        timeline.call(toggleFunction, [line, mask], toggleAt)
    }
}
