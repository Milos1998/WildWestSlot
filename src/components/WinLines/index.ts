import { Container, Graphics } from 'pixi.js'
import { REELS_HOLDER_FRAME_THICKNESS, STRIPE_SIZE, WIN_LINE_THICKNESS } from '../../constants'
import { LINE_COLORS, LINE_OFFSETS, WIN_LINES_DATA } from '../../constants/winLinesData'
import dataController from '../../logic/DataController'
import { Symbols } from '../../constants/winLinesData'
import gsap from 'gsap'
import Stripe from '../Stripe'

export default class WinLines extends Container {
    private lines: Graphics[] = []
    private myWidth = 0
    private myHeight = 0

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
            for (j = 0; j < wld.winPositions.length; j++) {
                offsetX += REELS_HOLDER_FRAME_THICKNESS
                line.lineTo(j * STRIPE_SIZE + offsetX, wld.winPositions[j] * STRIPE_SIZE + offsetY)
            }
            j--
            line.lineTo(j * STRIPE_SIZE + offsetX + (1 / 2) * STRIPE_SIZE, wld.winPositions[j] * STRIPE_SIZE + offsetY)
        }

        this.hideAllLines()
    }

    public displayOnlySelectedLines() {
        const numSelectedLines = dataController.getNumberOfLines()
        for (let i = 0; i < this.lines.length; i++)
            if (i < numSelectedLines) this.displayLine(i)
            else this.hideLine(i)
    }

    public displayAllLines() {
        for (let i = 0; i < this.lines.length; i++) this.displayLine(i)
    }

    public hideAllLines() {
        for (let i = 0; i < this.lines.length; i++) this.hideLine(i)
    }

    private displayLine(lineNum: number) {
        this.lines[lineNum].visible = true
    }

    private hideLine(lineNum: number) {
        this.lines[lineNum].visible = false
    }

    public async startWinningLinesAnimation(stripes: Stripe[][]) {
        this.queueWinningLinesAnimation(stripes)

        return dataController.animationSequencer.play('animateWinSymbols').then(() => {
            dataController.resetAnimationSequencer()
        })
    }

    public stopWinningLinesAnimation() {
        dataController.animationSequencer.repeat(0)
        dataController.animationSequencer.seek('endAnimateWinSymbols', false)
        //obrisi sve sto curi memoriju
    }

    private queueWinningLinesAnimation(stripes: Stripe[][]) {
        const wins = [...dataController.getWins()].sort((w1, w2) => w2.winAmount - w1.winAmount)

        dataController.animationSequencer.addLabel('animateWinSymbols')

        for (const win of wins) {
            const timeline = gsap.timeline()
            const mask = new Graphics()
            timeline.call(
                () => {
                    if (win.winSymbol !== Symbols.Reward1000) {
                        this.displayLine(win.winLine)
                        this.lines[win.winLine].mask = mask
                        this.lines[win.winLine].addChild(mask)
                    }
                },
                undefined,
                0
            )

            mask.x = REELS_HOLDER_FRAME_THICKNESS
            mask.beginFill(0x0, 1)
            mask.drawRect(0, 0, this.myWidth, this.myHeight)
            mask.endFill()
            //get all the symbols that are part of winning line and animate them on same timeline.
            for (let reelNum = 0; reelNum <= win.numberOfMatches; reelNum++) {
                const positionOnReel = WIN_LINES_DATA[win.winLine].winPositions[reelNum]
                stripes[reelNum][positionOnReel].animateSprite(timeline, this.lines[win.winLine], mask)
            }

            timeline.call(
                () => {
                    this.hideLine(win.winLine)
                    this.lines[win.winLine].mask = null
                    this.lines[win.winLine].removeChild(mask)
                },
                undefined,
                timeline.duration()
            )

            dataController.animationSequencer.add(timeline)
        }

        dataController.animationSequencer.repeat(-1)
        dataController.animationSequencer.pause()
        dataController.animationSequencer.addLabel('endAnimateWinSymbols', dataController.animationSequencer.duration())
    }
}
