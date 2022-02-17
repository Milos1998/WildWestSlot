import { Container, Graphics } from 'pixi.js'
import { REELS_HOLDER_FRAME_THICKNESS, STRIPE_SIZE, WIN_LINE_THICKNESS } from '../constants/constants'
import { LINE_COLORS, LINE_OFFSETS, WIN_LINES_DATA } from '../constants/winLinesData'
import dataController from '../logic/DataController'
import { Symbols } from '../constants/winLinesData'
import gsap from 'gsap'

export default class WinLines extends Container {
    private lines: Graphics[] = []
    constructor(x: number, y: number, width: number, height: number) {
        super()

        this.x = x - REELS_HOLDER_FRAME_THICKNESS
        this.y = y
        this.width = width
        this.height = height

        for (let i = 0; i < WIN_LINES_DATA.length; i++) {
            const wld = WIN_LINES_DATA[i]

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

    private maskReel(reelPosition: number) {
        //
        reelPosition
    }

    public animateWinningLines() {
        const wins = dataController.getWins().sort((w1, w2) => w1.winAmount - w2.winAmount)
        const stripes = dataController.getStripes()

        dataController.animationSequencer.addLabel('animateWinSymbols')

        for (const win of wins) {
            const timeline = gsap.timeline()
            timeline.call(
                () => {
                    if (win.winSymbol !== Symbols.Reward1000) this.displayLine(win.winLine)
                },
                undefined,
                0
            )

            for (let reelNum = 0; reelNum <= win.numberOfMatches; reelNum++) {
                this.maskReel(reelNum)
                const positionOnReel = WIN_LINES_DATA[win.winLine].winPositions[reelNum]
                stripes[reelNum][positionOnReel].animateSprite(timeline)
            }
            timeline.call(
                () => {
                    this.hideLine(win.winLine)
                },
                undefined,
                timeline.duration()
            )

            console.log(timeline.duration())
            dataController.animationSequencer.add(timeline)
        }
        console.log(dataController.animationSequencer.getChildren())

        dataController.animationSequencer.repeat(-1)
        dataController.animationSequencer.pause()
        dataController.animationSequencer.addLabel('endAnimateWinSymbols', dataController.animationSequencer.duration())
    }
}
