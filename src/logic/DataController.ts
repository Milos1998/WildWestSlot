import { gsap } from 'gsap'
import { AutoSpinBtnState, BETS, SpinBtnState, STARTING_BALANCE } from '../constants'
import { Symbols, WIN_LINES_DATA } from '../constants/winLinesData'
import { WinObject } from './WinCalculator'

class DataController {
    private static _instance: DataController | undefined = undefined
    private stripeSymbols: string[] = []
    private filteredStripeSymbols: string[] = []
    private _numberOfLines = WIN_LINES_DATA.length
    private selectedBetOption = Math.floor(BETS.length / 2)
    private _balance = STARTING_BALANCE
    public spinButtonState: SpinBtnState = SpinBtnState.Neutral
    public autoSpinButtonState: AutoSpinBtnState = AutoSpinBtnState.OffEnabled
    public animationSequencer
    public symbolCombination: string[][] = []
    public totalCashWin = 0
    public wins: WinObject[] = []

    private constructor() {
        this.animationSequencer = gsap.timeline()
        this.initStripeSymbols()
        this.resetStripeSymbolFilter()
    }

    static get instance() {
        if (!DataController._instance) {
            DataController._instance = new DataController()
        }
        return DataController._instance
    }

    public getStripeSymbols(filtered = true) {
        if (filtered) return this.filteredStripeSymbols
        return this.stripeSymbols
    }

    private initStripeSymbols() {
        const syms: string[] = []
        Object.values(Symbols).forEach((sym) => syms.push(sym))
        this.stripeSymbols = syms
    }

    public filterStripeSymbols(...unwantedSymbols: string[]) {
        this.filteredStripeSymbols = this.filteredStripeSymbols.filter((symbol) => {
            return unwantedSymbols.find((unwanted) => unwanted === symbol) === undefined
        })
    }

    public resetStripeSymbolFilter() {
        this.filteredStripeSymbols = this.stripeSymbols
    }

    public resetAnimationSequencer() {
        this.animationSequencer.kill()
        this.animationSequencer = gsap.timeline()
    }

    get maxNumberOfLines() {
        return WIN_LINES_DATA.length
    }

    get numberOfLines() {
        return this._numberOfLines
    }

    public decrementNumberOfLines() {
        if (this._numberOfLines > 1) this._numberOfLines--
        return this._numberOfLines
    }

    public incrementNumberOfLines() {
        if (this._numberOfLines < WIN_LINES_DATA.length) this._numberOfLines++
        return this._numberOfLines
    }

    get bet() {
        return BETS[this.selectedBetOption]
    }

    get totalBet() {
        return this._numberOfLines * this.bet
    }

    public decrementBet() {
        if (this.selectedBetOption > 0) this.selectedBetOption--
        return BETS[this.selectedBetOption]
    }

    public incrementBet() {
        if (this.selectedBetOption < BETS.length - 1) this.selectedBetOption++
        return BETS[this.selectedBetOption]
    }

    get maxBet() {
        return BETS[BETS.length - 1]
    }

    get minBet() {
        return BETS[0]
    }

    get balance() {
        return this._balance
    }

    public updateBalance(amount: number) {
        this._balance += amount
    }
}

const dataController: DataController = DataController.instance
export default dataController
