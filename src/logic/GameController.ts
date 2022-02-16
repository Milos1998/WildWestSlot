import { Application } from 'pixi.js'
import * as PIXI from 'pixi.js' //for gsap
import SlotMachine from '../components/SlotMachine'
import AssetLoader from './AssetLoader'
import dataController from './DataController'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import winCalculator from './WinCalculator'
import { Symbols } from '../constants/winLinesData'
import { SpinBtnState } from '../constants/constants'

//Syncs processes of the game
class GameController {
    private static instance: GameController | undefined = undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private app: Application = undefined as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private slotMachine: SlotMachine = undefined as any

    public static getInstance() {
        if (!GameController.instance) {
            GameController.instance = new GameController()
        }

        return GameController.instance
    }

    public initGameController(_app: Application) {
        this.app = _app
        const loader: AssetLoader = new AssetLoader()

        this.app.stage.addChild(loader)
    }

    //get's called from Loader when caching is finished
    public initGameElements() {
        PixiPlugin.registerPIXI(PIXI)
        gsap.registerPlugin(PixiPlugin)

        this.slotMachine = new SlotMachine()
        this.app.stage.addChild(this.slotMachine)
        this.applySpecialProperties()
    }

    private applySpecialProperties() {
        dataController.filterStripeSymbols(Symbols.NINE, Symbols.TEN, Symbols.J, Symbols.K, Symbols.Q, Symbols.A)
    }

    public increaseNumberOfLines() {
        const newNumOfLines = dataController.incrementNumberOfLines()

        if (newNumOfLines === dataController.getMaxNumberOfLines()) this.slotMachine.linesSelector.disableMoreButton()
        this.slotMachine.linesSelector.enableLessButton()

        this.slotMachine.linesSelector.setDisplayValue(newNumOfLines)
        this.slotMachine.totalBetDisplay.setDisplayValue(dataController.getTotalBet())

        this.slotMachine.winLines.displayOnlySelectedLines()
    }

    public decreaseNumberOfLines() {
        const newNumOfLines = dataController.decrementNumberOfLines()

        if (newNumOfLines === 1) this.slotMachine.linesSelector.disableLessButton()
        this.slotMachine.linesSelector.enableMoreButton()

        this.slotMachine.linesSelector.setDisplayValue(newNumOfLines)
        this.slotMachine.totalBetDisplay.setDisplayValue(dataController.getTotalBet())

        this.slotMachine.winLines.displayOnlySelectedLines()
    }

    public increaseBet() {
        const newBet = dataController.incrementBet()

        if (newBet === dataController.getMaxBet()) this.slotMachine.betSelector.disableMoreButton()
        this.slotMachine.betSelector.enableLessButton()

        this.slotMachine.betSelector.setDisplayValue(newBet)
        this.slotMachine.totalBetDisplay.setDisplayValue(dataController.getTotalBet())

        this.slotMachine.winLines.hideAllLines()
    }

    public decreaseBet() {
        const newBet = dataController.decrementBet()

        if (newBet === dataController.getMinBet()) this.slotMachine.betSelector.disableLessButton()
        this.slotMachine.betSelector.enableMoreButton()

        this.slotMachine.betSelector.setDisplayValue(newBet)
        this.slotMachine.totalBetDisplay.setDisplayValue(dataController.getTotalBet())

        this.slotMachine.winLines.hideAllLines()
    }

    public spinAutomatiaclly() {
        //TODO  refactore spin logic
        dataController.reverseAutoSpinActivated()
    }

    public handleSpinButtonEvent() {
        switch (dataController.getSpinBtnState()) {
            case SpinBtnState.Neutral: {
                this.spinManually()
                break
            }
            case SpinBtnState.Skip: {
                this.skipSpinAnimation()
                break
            }
            case SpinBtnState.Collect: {
                this.collectCash()
                break
            }
        }
    }

    public skipSpinAnimation() {
        dataController.animationSequencer.seek('reelsStopping', false)
    }

    public collectCash() {
        dataController.addToBalance(dataController.getTotalCashWin())
        this.slotMachine.balance.setDisplayValue(dataController.getBalance())
        dataController.animationSequencer.seek('endAnimateWinSymbols', false)
    }

    public async spinManually() {
        this.slotMachine.autoSpinButton.setStateOffDisabled()
        this.slotMachine.spinButton.setStateSkip()
        this.slotMachine.betSelector.disableSelector()
        this.slotMachine.linesSelector.disableSelector()
        this.slotMachine.winLines.hideAllLines()

        this.slotMachine.reelsHolder.spinReels()
        dataController.animationSequencer.call(
            () => {
                this.slotMachine.spinButton.setStateDisabledSkip()
            },
            undefined,
            'reelsStopping'
        )
        await dataController.animationSequencer.play('spinReels').then(() => {
            dataController.animationSequencer.clear()
        })

        winCalculator.calculateWin()
        console.log(dataController.getWins())
        if (dataController.getTotalCashWin()) {
            this.slotMachine.spinButton.setStateCollect()
            this.slotMachine.cashTray.setDisplayValue(dataController.getTotalCashWin())
            this.slotMachine.winLines.animateWinningLines()
            await dataController.animationSequencer.play('animateWinSymbols').then(() => {
                dataController.animationSequencer.clear()
            })
        }

        this.slotMachine.cashTray.setDisplayValue('')
        this.slotMachine.autoSpinButton.setStateOffEnabled()
        this.slotMachine.spinButton.setStateNeutral()
        this.slotMachine.betSelector.enableSelector()
        this.slotMachine.linesSelector.enableSelector()
    }

    private spin() {
        console.log('spin')
    }
}

const gameController: GameController = GameController.getInstance()
export default gameController
