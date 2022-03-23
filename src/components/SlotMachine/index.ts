import gsap from 'gsap/all'
import { Container, Sprite, Texture } from 'pixi.js'
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
    reelsHolderWidth,
    REELS_HOLDER_X,
    REELS_HOLDER_Y,
    RIGHT_PANNEL_X,
    SPIN_BUTTON_X,
    TOTAL_BET_DISPLAY_Y,
    AUTO_SPIN_BUTTON_X,
    CASH_TRAY_ANIMATION_END_PAUSE,
    REELS_PER_REEL_HOLDER
} from '../../constants'
import dataController from '../../logic/DataController'
import gameController from '../../logic/GameController'
import soundController from '../../logic/SoundController'
import AutoSpinButton from '../AutoSpinButton'
import Display from '../Display'
import { Info } from '../Info'
import { Modal } from '../Modal'
import ReelsHolder from '../ReelsHolder'
import SpinButton from '../SpinButton'

export default class SlotMachine extends Container {
    private machineDecoration: Sprite
    private _reelsHolder: ReelsHolder
    private _bonusReelHolder: ReelsHolder | undefined = undefined
    public linesSelector: Display
    public betSelector: Display
    public totalBetDisplay: Display
    public cashTray: Display
    public balance: Display
    public spinButton: SpinButton
    public autoSpinButton: AutoSpinButton
    private infoButton: Info
    private mainTimeline: gsap.core.Timeline
    public modal: Modal

    constructor() {
        super()

        //set background image
        this.machineDecoration = new Sprite(Texture.from('background'))
        this.machineDecoration.x = 0
        this.machineDecoration.y = 0
        this.addChild(this.machineDecoration)

        //reels holder
        this._reelsHolder = new ReelsHolder(
            REELS_HOLDER_X,
            REELS_HOLDER_Y,
            reelsHolderWidth(REELS_PER_REEL_HOLDER),
            REELS_HOLDER_HEIGHT,
            REELS_PER_REEL_HOLDER
        )
        this.addChild(this._reelsHolder)

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

        this.modal = new Modal()
        this.addChild(this.modal)

        this.mainTimeline = gsap.timeline()
    }

    get reelsHolder() {
        if (this._bonusReelHolder) return this._bonusReelHolder
        return this._reelsHolder
    }

    public startBonusMode(numOfReels: number) {
        this.removeChild(this.modal)
        this._reelsHolder.visible = false
        this._bonusReelHolder = new ReelsHolder(
            REELS_HOLDER_X + (reelsHolderWidth(REELS_PER_REEL_HOLDER) - reelsHolderWidth(numOfReels)) / 2,
            REELS_HOLDER_Y,
            reelsHolderWidth(numOfReels),
            REELS_HOLDER_HEIGHT,
            numOfReels
        )
        this.addChild(this._bonusReelHolder)
        this.addChild(this.modal)
        this.machineDecoration.texture = Texture.from('bonus mode background')
        soundController.backgroundSong.stop()
        soundController.bonusLevelSong.play()
    }

    public endBonusMode() {
        if (!this._bonusReelHolder) throw new Error('Failed to delete bonus reels holder')
        this.removeChild(this._bonusReelHolder)
        this._bonusReelHolder.destroy()
        this._bonusReelHolder = undefined
        this.modal.resetFilter()
        this._reelsHolder.visible = true
        this.machineDecoration.texture = Texture.from('background')
        soundController.bonusLevelSong.stop()
        soundController.backgroundSong.play()
    }

    public async animateWin() {
        this.queueWinAnimations()

        return this.mainTimeline.play()
    }

    private queueWinAnimations() {
        const winlinesAnimation = this.reelsHolder.winLines.queueWinningLinesAnimation(this.reelsHolder.stripes)

        let cashAnimationDuration: number
        if (dataController.totalCashWin < 2 * dataController.totalBet) cashAnimationDuration = 1
        else if (dataController.totalCashWin < 5 * dataController.totalBet) cashAnimationDuration = 2
        else cashAnimationDuration = 4

        const cashTrayAnimation = this.cashTray.queueDisplayValueChangeAnimation(
            dataController.totalCashWin,
            cashAnimationDuration,
            () => {
                // soundController.playCoinDrop()
            }
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
        this.reelsHolder.winLines.stopWinningLinesAnimation()
        this.cashTray.stopDisplayValueChangeAnimation()
        this.mainTimeline.pause().progress(1)
        this.resetMainTimeline()
    }

    public animateBonusRoundIntro() {
        this.queueBonusRoundIntro()

        return this.mainTimeline.play()
    }

    private queueBonusRoundIntro() {
        //stirpe.bonus animation
        this.mainTimeline.to(this.machineDecoration, { x: 0, duration: 2 })
        this.mainTimeline.call(
            () => {
                soundController.eagle.play()
            },
            undefined,
            0
        )
    }

    public stopBonusRoundIntro() {
        this.resetMainTimeline()
    }

    private resetMainTimeline() {
        this.mainTimeline.kill()
        this.mainTimeline = gsap.timeline()
    }
}
