import { Application } from 'pixi.js'
import * as PIXI from 'pixi.js' //for gsap
import SlotMachine from '../components/SlotMachine'
import dataController from './DataController'
import { gsap } from 'gsap'
import { PixiPlugin } from 'gsap/PixiPlugin'
import winCalculator from './WinCalculator'
import { Symbols } from '../constants/winLinesData'
import { AutoSpinBtnState, SpinBtnState } from '../constants'
import assetLoader from './AssetLoader'

//Syncs processes of the game
class GameController {
    private static _instance: GameController | undefined = undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private app: Application = undefined as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private slotMachine: SlotMachine = undefined as any

    static get instance() {
        if (!GameController._instance) {
            GameController._instance = new GameController()
        }

        return GameController._instance
    }

    public initGameController(_app: Application) {
        this.app = _app
        this.app.stage.addChild(assetLoader)
    }

    //get's called from Loader when caching is finished
    public initGameElements() {
        PixiPlugin.registerPIXI(PIXI)
        gsap.registerPlugin(PixiPlugin)
        this.applySpecialProperties()

        this.slotMachine = new SlotMachine()
        this.app.stage.addChild(this.slotMachine)
    }

    private applySpecialProperties() {
        const filterSymbols = [Symbols.NINE, Symbols.TEN, Symbols.J, Symbols.K, Symbols.Q, Symbols.A]
        filterSymbols.forEach((sym) => dataController.filterStripeSymbols(sym, false))
    }

    public increaseNumberOfLines() {
        const newNumOfLines = dataController.incrementNumberOfLines()

        if (newNumOfLines === dataController.maxNumberOfLines) this.slotMachine.linesSelector.disableMoreButton()
        this.slotMachine.linesSelector.enableLessButton()

        this.slotMachine.linesSelector.displayValue = newNumOfLines
        this.slotMachine.totalBetDisplay.displayValue = dataController.totalBet

        this.slotMachine.winLines.displayOnlySelectedLines()
    }

    public decreaseNumberOfLines() {
        const newNumOfLines = dataController.decrementNumberOfLines()

        if (newNumOfLines === 1) this.slotMachine.linesSelector.disableLessButton()
        this.slotMachine.linesSelector.enableMoreButton()

        this.slotMachine.linesSelector.displayValue = newNumOfLines
        this.slotMachine.totalBetDisplay.displayValue = dataController.totalBet

        this.slotMachine.winLines.displayOnlySelectedLines()
    }

    public increaseBet() {
        const newBet = dataController.incrementBet()

        if (newBet === dataController.maxBet) this.slotMachine.betSelector.disableMoreButton()
        this.slotMachine.betSelector.enableLessButton()

        this.slotMachine.betSelector.displayValue = newBet
        this.slotMachine.totalBetDisplay.displayValue = dataController.totalBet

        this.slotMachine.winLines.hideAllLines()
    }

    public decreaseBet() {
        const newBet = dataController.decrementBet()

        if (newBet === dataController.minBet) this.slotMachine.betSelector.disableLessButton()
        this.slotMachine.betSelector.enableMoreButton()

        this.slotMachine.betSelector.displayValue = newBet
        this.slotMachine.totalBetDisplay.displayValue = dataController.totalBet

        this.slotMachine.winLines.hideAllLines()
    }

    public async spinAutomatiaclly() {
        this.slotMachine.autoSpinButton.setStateOn()

        while (dataController.autoSpinButtonState === AutoSpinBtnState.On) {
            await this.spin()
        }

        this.slotMachine.autoSpinButton.setStateOffEnabled()
        this.slotMachine.spinButton.setStateNeutral()
        this.slotMachine.betSelector.enableSelector()
        this.slotMachine.linesSelector.enableSelector()
    }

    public handleAutoSpinButtonEvent() {
        switch (dataController.autoSpinButtonState) {
            case AutoSpinBtnState.On: {
                this.slotMachine.autoSpinButton.setStateOffDisabled()
                break
            }
            case AutoSpinBtnState.OffEnabled: {
                this.spinAutomatiaclly()
                break
            }
        }
    }

    public async spinManually() {
        this.slotMachine.autoSpinButton.setStateOffDisabled()

        await this.spin()

        this.slotMachine.autoSpinButton.setStateOffEnabled()
        this.slotMachine.spinButton.setStateNeutral()
        this.slotMachine.betSelector.enableSelector()
        this.slotMachine.linesSelector.enableSelector()
    }

    public handleSpinButtonEvent() {
        switch (dataController.spinButtonState) {
            case SpinBtnState.Neutral: {
                this.spinManually()
                break
            }
            case SpinBtnState.Skip: {
                this.slotMachine.reelsHolder.slamStopAnimation()
                break
            }
            case SpinBtnState.Collect: {
                this.collectCash()
                break
            }
        }
    }

    public collectCash() {
        dataController.updateBalance(dataController.totalCashWin)
        this.slotMachine.balance.displayValue = dataController.balance
        this.slotMachine.winLines.stopWinningLinesAnimation()
    }

    private async spin() {
        this.slotMachine.spinButton.setStateSkip()
        this.slotMachine.betSelector.disableSelector()
        this.slotMachine.linesSelector.disableSelector()
        this.slotMachine.winLines.hideAllLines()

        await this.takeMoney(dataController.totalBet)

        await this.slotMachine.reelsHolder.spinReels(() => {
            this.slotMachine.spinButton.setStateDisabledSkip()
        })

        winCalculator.calculateWin()
        if (dataController.totalCashWin) {
            this.slotMachine.spinButton.setStateCollect()
            this.slotMachine.cashTray.displayValue = dataController.totalCashWin
            await this.slotMachine.winLines.startWinningLinesAnimation(this.slotMachine.reelsHolder.stripes)
        }

        this.slotMachine.cashTray.displayValue = ''
    }

    private async takeMoney(amount: number) {
        if (dataController.balance < amount) {
            alert('insufficient funds')
            await this.gameOver()
        }

        dataController.updateBalance(-amount)
        this.slotMachine.balance.displayValue = dataController.balance
    }

    private async gameOver() {
        this.slotMachine.linesSelector.disableSelector()
        this.slotMachine.betSelector.disableSelector()
        this.slotMachine.spinButton.setStateDisabledSkip()
        this.slotMachine.autoSpinButton.setStateOffDisabled()

        await this.slotMachine.reelsHolder.dance()
    }
}

const gameController: GameController = GameController.instance
export default gameController
