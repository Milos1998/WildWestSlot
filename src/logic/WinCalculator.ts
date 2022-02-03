import { PAYTABLE, Symbols, WIN_LINES_DATA } from "../constants/winLinesData"
import dataController from "./DataController"

export class WinObject{
    winAmount: number= 0
    winLine: number= 0
    winSymbol: string= ""
    numberOfMatches: number= 0
}

class WinCalculator{
    private symOfCurrentLine: string= undefined as any
    private previousSym: string= undefined as any
    private totalWinAmount= 0
    //TODO: refactor whole class - maybe split it to calculate every property of winObject in different method

    public calculateWin(symbolCombination: string[][]){
        let wins= []
        this.totalWinAmount= 0
        for(let i= 0; i < dataController.getNumberOfLines(); i++){
            let wp= WIN_LINES_DATA[i].winPositions
            this.symOfCurrentLine= symbolCombination[0][wp[0]]
            this.previousSym= symbolCombination[0][wp[0]]

            let win: WinObject= new WinObject
            win.winSymbol= this.symOfCurrentLine
            win.winLine= i
    
            for(let j= 1; j < wp.length; j++){
                if(this.isMatching(symbolCombination[j][wp[j]])){
                    if (this.symOfCurrentLine !== this.previousSym){
                        this.symOfCurrentLine= this.previousSym
                        wins.push({... win})
                        win.winSymbol= this.previousSym
                    }
                    win.numberOfMatches++
                }
                else{
                    break;
                }
            }
    
            wins.push(win)
        }

        wins= wins.filter(win => win.numberOfMatches > 0)

        wins= this.calculateWinAmounts(wins)

        return {
            totalCashWin: this.totalWinAmount,
            wins: wins
        }
    }

    private calculateWinAmounts(wins: WinObject[]){
        wins.forEach(win =>{
            if(win.winSymbol !== Symbols.Reward1000){
                let payoutData= PAYTABLE.find(pay => pay.symbol === win.winSymbol) as any
                win.winAmount= payoutData.payoutPerMatch[win.numberOfMatches] * dataController.getBet()
            }
            else{
                let payout= PAYTABLE.find(pay => pay.symbol === Symbols.Reward1000)?.specialPayout as any
                win.winAmount= payout[win.numberOfMatches] * dataController.getTotalBet()
            }

            this.totalWinAmount+= win.winAmount
        })


        return wins.filter(win => win.winAmount !== 0)
        // return wins.map(win => {
        //     if (win.winAmount)
        //         return win
        // }) as WinObject[]
    }

    private isMatching(sym: string): boolean{
        switch (sym){
            case Symbols.Reward1000:{
                return false
            }
            case Symbols.Wild:{
                return true
            }
            case this.previousSym:{
                return true
            }
            default:{
                if (this.previousSym === Symbols.Wild){
                    this.previousSym= sym
                    return true
                }
                else
                    return false
            }
        }
    }

}

const winCalculator: WinCalculator= new WinCalculator()
export default winCalculator