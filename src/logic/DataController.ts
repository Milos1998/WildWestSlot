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
    public totalCashWin = 0
    public wins: WinObject[] = []
    public autoSpinning = false

    private constructor() {
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
        Object.values(Symbols).forEach((sym) => this.stripeSymbols.push(sym))
    }

    public filterStripeSymbols(symbol: string, included: boolean) {
        if (dataController.stripeSymbols.indexOf(symbol) === -1) throw new Error('invalid symbol passed to filter')
        if (!included && dataController.filteredStripeSymbols.length === 1) throw new Error('too few Stripes')

        const index = dataController.filteredStripeSymbols.indexOf(symbol)

        if (included && index === -1) dataController.filteredStripeSymbols.push(symbol)
        else if (!included && index !== -1) dataController.filteredStripeSymbols.splice(index, 1)
        else throw new Error(`element is ${index === -1 ? 'not' : ''} in array`)
    }

    public resetStripeSymbolFilter() {
        this.filteredStripeSymbols = [...this.stripeSymbols]
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
