import gsap from 'gsap/all'
import { Container, Sprite } from 'pixi.js'
import {
    BALANCE_Y,
    BET_SELECTOR_Y,
    CASH_TRAY_Y,
    BUTTONS_SIZE,
    CENTRAL_PANNEL_Y,
    DISPLAYS_HEIGHT,
    DISPLAYS_WIDTH,
    LEFT_PANNEL_X,
    LINES_SELECTOR_Y,
    REELS_HOLDER_HEIGHT,
    REELS_HOLDER_WIDTH,
    REELS_HOLDER_X,
    REELS_HOLDER_Y,
    RIGHT_PANNEL_X,
    SPIN_BUTTON_X,
    TOTAL_BET_DISPLAY_Y,
    AUTO_SPIN_BUTTON_X,
    CASH_TRAY_ANIMATION_END_PAUSE
} from '../../constants'
import dataController from '../../logic/DataController'
import gameController from '../../logic/GameController'
import AutoSpinButton from '../AutoSpinButton'
import Display from '../Display'
import { Info } from '../Info'
import ReelsHolder from '../ReelsHolder'
import SpinButton from '../SpinButton'
import WinLines from '../WinLines'

export default class SlotMachine extends Container {
    private machineDecoration: Sprite
    //controllable elements
    public reelsHolder: ReelsHolder
    public linesSelector: Display
    public betSelector: Display
    public totalBetDisplay: Display
    public cashTray: Display
    public balance: Display
    public spinButton: SpinButton
    public autoSpinButton: AutoSpinButton
    public winLines: WinLines
    private infoButton: Info
    private mainTimeline: gsap.core.Timeline

    constructor() {
        super()

        //set background image
        this.machineDecoration = Sprite.from('machine-decoration')
        this.machineDecoration.x = 0
        this.machineDecoration.y = 0
        this.addChild(this.machineDecoration)

        //reels holder
        this.reelsHolder = new ReelsHolder(REELS_HOLDER_X, REELS_HOLDER_Y, REELS_HOLDER_WIDTH, REELS_HOLDER_HEIGHT)
        this.addChild(this.reelsHolder)

        //winlines
        this.winLines = new WinLines(REELS_HOLDER_X, REELS_HOLDER_Y, REELS_HOLDER_WIDTH, REELS_HOLDER_HEIGHT)
        this.addChild(this.winLines)

        //left pannel
        this.linesSelector = new Display(
            LEFT_PANNEL_X,
            LINES_SELECTOR_Y,
            DISPLAYS_WIDTH,
            DISPLAYS_HEIGHT,
            dataController.maxNumberOfLines.toString(),
            'Lines',
            true
        )
        this.linesSelector.lessButton.addListener('pointertap', () => gameController.decreaseNumberOfLines())
        this.linesSelector.enableLessButton()
        this.linesSelector.moreButton.addListener('pointertap', () => gameController.increaseNumberOfLines())
        this.linesSelector.disableMoreButton()

        this.betSelector = new Display(
            LEFT_PANNEL_X,
            BET_SELECTOR_Y,
            DISPLAYS_WIDTH,
            DISPLAYS_HEIGHT,
            dataController.bet.toString(),
            'Bet per line',
            true
        )
        this.betSelector.lessButton.addListener('pointertap', () => gameController.decreaseBet())
        this.betSelector.enableLessButton()
        this.betSelector.moreButton.addListener('pointertap', () => gameController.increaseBet())
        this.betSelector.enableMoreButton()

        this.totalBetDisplay = new Display(
            LEFT_PANNEL_X,
            TOTAL_BET_DISPLAY_Y,
            DISPLAYS_WIDTH,
            DISPLAYS_HEIGHT,
            dataController.totalBet.toString(),
            'Total bet'
        )
        this.addChild(this.linesSelector, this.betSelector, this.totalBetDisplay)

        //right pannel
        this.cashTray = new Display(RIGHT_PANNEL_X, CASH_TRAY_Y, DISPLAYS_WIDTH, DISPLAYS_HEIGHT, '', 'Cash tray')
        this.balance = new Display(
            RIGHT_PANNEL_X,
            BALANCE_Y,
            DISPLAYS_WIDTH,
            DISPLAYS_HEIGHT,
            dataController.balance.toString(),
            'Balance'
        )
        this.addChild(this.cashTray, this.balance)

        //central pannel
        this.spinButton = new SpinButton(SPIN_BUTTON_X, CENTRAL_PANNEL_Y, BUTTONS_SIZE)
        this.autoSpinButton = new AutoSpinButton(AUTO_SPIN_BUTTON_X, CENTRAL_PANNEL_Y, BUTTONS_SIZE)
        this.addChild(this.spinButton, this.autoSpinButton)

        this.infoButton = new Info()
        this.addChild(this.infoButton)

        this.mainTimeline = gsap.timeline()
    }

    public async animateWin() {
        this.queueWinAnimations()

        return this.mainTimeline.play()
    }

    private queueWinAnimations() {
        const winlinesAnimation = this.winLines.queueWinningLinesAnimation(this.reelsHolder.stripes)

        let cashAnimationDuration: number
        if (dataController.totalCashWin < 2 * dataController.totalBet) cashAnimationDuration = 1
        else if (dataController.totalCashWin < 5 * dataController.totalBet) cashAnimationDuration = 2
        else cashAnimationDuration = 4

        const cashTrayAnimation = this.cashTray.queueDisplayValueChangeAnimation(
            dataController.totalCashWin,
            cashAnimationDuration
        )

        cashTrayAnimation.call(
            () => {
                setTimeout(() => {
                    if (dataController.autoSpinning) this.stopWinAnimation()
                }, CASH_TRAY_ANIMATION_END_PAUSE)
            },
            undefined,
            cashTrayAnimation.duration()
        )

        this.mainTimeline.add(winlinesAnimation)
        this.mainTimeline.add(cashTrayAnimation, 0)
    }

    public stopWinAnimation() {
        this.winLines.stopWinningLinesAnimation()
        this.cashTray.stopDisplayValueChangeAnimation()
        this.mainTimeline.pause().progress(1)
        this.resetMainTimeline()
    }

    private resetMainTimeline() {
        this.mainTimeline.kill()
        this.mainTimeline = gsap.timeline()
    }
}
