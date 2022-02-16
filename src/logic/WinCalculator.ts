import { PAYTABLE, Symbols, WIN_LINES_DATA } from '../constants/winLinesData'
import dataController from './DataController'

export class WinObject {
    winAmount = 0
    winLine = 0
    winSymbol = ''
    numberOfMatches = 0
}

class WinCalculator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private symOfCurrentLine: string = undefined as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private previousSym: string = undefined as any
    private totalWinAmount = 0
    //TODO: refactor whole class - maybe split it to calculate every property of winObject in different method

    public calculateWin() {
        const symbolCombination = dataController.getSymbolCombination()
        const wins = []
        this.totalWinAmount = 0
        for (let i = 0; i < dataController.getNumberOfLines(); i++) {
            const wp = WIN_LINES_DATA[i].winPositions
            this.symOfCurrentLine = symbolCombination[0][wp[0]]
            this.previousSym = symbolCombination[0][wp[0]]

            const win: WinObject = new WinObject()
            win.winSymbol = this.symOfCurrentLine
            win.winLine = i

            for (let j = 1; j < wp.length; j++) {
                if (this.isMatching(symbolCombination[j][wp[j]])) {
                    if (this.symOfCurrentLine !== this.previousSym) {
                        this.symOfCurrentLine = this.previousSym
                        wins.push({ ...win })
                        win.winSymbol = this.previousSym
                    }
                    win.numberOfMatches++
                } else {
                    break
                }
            }

            wins.push(win)
        }

        dataController.setWins(this.calculateWinAmounts(wins.filter((win) => win.numberOfMatches > 0)))
        dataController.setTotalCashWin(this.totalWinAmount)
    }

    private calculateWinAmounts(wins: WinObject[]) {
        wins.forEach((win) => {
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

        return wins.filter((win) => win.winAmount !== 0)
    }

    private isMatching(sym: string): boolean {
        switch (sym) {
            case Symbols.Reward1000: {
                return false
            }
            case Symbols.Wild: {
                return true
            }
            case this.previousSym: {
                return true
            }
            default: {
                if (this.previousSym === Symbols.Wild) {
                    this.previousSym = sym
                    return true
                } else return false
            }
        }
    }
}

const winCalculator: WinCalculator = new WinCalculator()
export default winCalculator
