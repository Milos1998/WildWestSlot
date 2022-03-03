import { REELS_PER_REEL_HOLDER } from '../constants'
import { PAYTABLE, Symbols, WIN_LINES_DATA } from '../constants/winLinesData'
import dataController from './DataController'

export class WinObject {
    winAmount = 0
    winLine = 0
    winSymbol = ''
    numberOfMatches = 0
}

class WinCalculator {
    private static instance: WinCalculator | undefined = undefined
    private totalWinAmount = 0
    private wins: WinObject[] = []

    public static getInstance() {
        if (!WinCalculator.instance) WinCalculator.instance = new WinCalculator()

        return WinCalculator.instance
    }

    public calculateWin() {
        this.wins = []
        this.totalWinAmount = 0

        this.calculateMatches()
        this.calculateSpecials()
        this.calculateWinAmounts()

        dataController.setWins(this.wins)
        dataController.setTotalCashWin(this.totalWinAmount)
    }

    private calculateMatches() {
        const symbolCombination = dataController.getSymbolCombination()
        for (let currentLine = 0; currentLine < dataController.getNumberOfLines(); currentLine++) {
            const wp = WIN_LINES_DATA[currentLine].winPositions

            const first = symbolCombination[0][wp[0]]
            if (first === Symbols.Reward1000) continue

            const win: WinObject = new WinObject()
            win.winSymbol = first
            win.winLine = currentLine

            for (let currentReel = 1; currentReel < REELS_PER_REEL_HOLDER; currentReel++) {
                if (this.isMatching(symbolCombination[currentReel][wp[currentReel]], win)) {
                    win.numberOfMatches++
                } else {
                    break
                }
            }
            this.wins.push(win)
        }

        this.wins = this.wins.filter((win) => win.numberOfMatches > 0)
    }

    private isMatching(sym: string, win: WinObject): boolean {
        switch (sym) {
            case Symbols.Reward1000: {
                return false
            }
            case Symbols.Wild: {
                return true
            }
            case win.winSymbol: {
                return true
            }
            default: {
                if (win.winSymbol === Symbols.Wild) {
                    this.wins.push({ ...win })
                    win.winSymbol = sym
                    return true
                } else {
                    return false
                }
            }
        }
    }

    private calculateSpecials() {
        const symbolCombination = dataController.getSymbolCombination()

        const win = new WinObject()
        win.winSymbol = Symbols.Reward1000
        let found = 0
        for (const reel of symbolCombination) {
            for (const sym of reel) {
                if (sym === Symbols.Reward1000) found++
            }
        }

        if (found > REELS_PER_REEL_HOLDER) found = REELS_PER_REEL_HOLDER

        win.numberOfMatches = found - 1
        if (found) this.wins.push(win)
    }

    private calculateWinAmounts() {
        this.wins.forEach((win) => {
            if (win.winSymbol !== Symbols.Reward1000) {
                const payoutData = PAYTABLE.find((pay) => pay.symbol === win.winSymbol)
                if (!payoutData) return
                win.winAmount = payoutData.payoutPerMatch[win.numberOfMatches] * dataController.getBet()
            } else {
                const payout = PAYTABLE.find((pay) => pay.symbol === Symbols.Reward1000)?.specialPayout
                if (!payout) return
                win.winAmount = payout[win.numberOfMatches] * dataController.getTotalBet()
            }

            this.totalWinAmount += win.winAmount
        })

        this.wins = this.wins.filter((win) => win.winAmount !== 0)
    }
}

const winCalculator: WinCalculator = WinCalculator.getInstance()
export default winCalculator
