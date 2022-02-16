import { gsap } from 'gsap'
import Stripe from '../components/Stripe'
import { BETS, SpinBtnState, STARTING_BALANCE } from '../constants/constants'
import { Symbols, WIN_LINES_DATA } from '../constants/winLinesData'
import { WinObject } from './WinCalculator'

class DataController {
    private static instance: DataController | undefined = undefined
    private stripeSymbols: string[] = []
    private filteredStripeSymbols: string[] = []
    private numberOfLines = WIN_LINES_DATA.length
    private selectedBetOption = 3
    private balance = STARTING_BALANCE
    private spinBtnState = SpinBtnState.Neutral
    private autoSpinActivated = false
    public animationSequencer
    private symbolCombination: string[][] = []
    private totalCashWin = 0
    private wins: WinObject[] = []
    private stripes: Stripe[][] = []

    private constructor() {
        this.animationSequencer = gsap.timeline()
        this.initStripeSymbols()
        this.resetStripeSymbolFilter()
    }

    public static getInstance() {
        if (!DataController.instance) {
            DataController.instance = new DataController()
        }
        return DataController.instance
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

    public getMaxNumberOfLines() {
        return WIN_LINES_DATA.length
    }

    public getNumberOfLines() {
        return this.numberOfLines
    }

    public decrementNumberOfLines() {
        if (this.numberOfLines > 1) this.numberOfLines--
        return this.numberOfLines
    }

    public incrementNumberOfLines() {
        if (this.numberOfLines < WIN_LINES_DATA.length) this.numberOfLines++
        return this.numberOfLines
    }

    public getBet() {
        return BETS[this.selectedBetOption]
    }

    public getTotalBet() {
        return this.numberOfLines * this.getBet()
    }

    public decrementBet() {
        if (this.selectedBetOption > 0) this.selectedBetOption--
        return BETS[this.selectedBetOption]
    }

    public incrementBet() {
        if (this.selectedBetOption < BETS.length - 1) this.selectedBetOption++
        return BETS[this.selectedBetOption]
    }

    public getMaxBet() {
        return BETS[BETS.length - 1]
    }

    public getMinBet() {
        return BETS[0]
    }

    public getBalance() {
        return this.balance
    }

    public addToBalance(amount: number) {
        this.balance += amount
    }

    public setSpinBtnState(state: SpinBtnState) {
        this.spinBtnState = state
    }

    public getSpinBtnState() {
        return this.spinBtnState
    }

    public reverseAutoSpinActivated() {
        this.autoSpinActivated = !this.autoSpinActivated
    }

    public isAutoSpinActivated() {
        return this.autoSpinActivated
    }

    public setSymbolCombination(symbolCombination: string[][]) {
        this.symbolCombination = symbolCombination
    }

    public getSymbolCombination() {
        return this.symbolCombination
    }

    public setTotalCashWin(totalCashWin: number) {
        this.totalCashWin = totalCashWin
    }

    public getTotalCashWin() {
        return this.totalCashWin
    }

    public setWins(wins: WinObject[]) {
        this.wins = wins
    }

    public getWins() {
        return this.wins
    }

    public setStripes(stripes: Stripe[][]) {
        this.stripes = stripes
    }

    public getStripes() {
        return this.stripes
    }
}

const dataController: DataController = DataController.getInstance()
export default dataController
