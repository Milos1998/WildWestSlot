import { Symbols, WIN_LINES_DATA } from "../constants/winLinesData"
import { dataController } from "./DataController"

class winObject{
    public winAmount: number= 0
    public winLine: number= 0
    public winSymbol: string= ""
    public winMatches: number= 0
}

class WinCalculator{
    private symOfCurrentLine: string= undefined as any
    private previousSym: string= undefined as any

    public calculateWin(symbolCombination: string[][]){
        for(let i= 0; i < dataController.getNumberOfLines(); i++){
            let wp= WIN_LINES_DATA[i].winPositions

            this.symOfCurrentLine= symbolCombination[0][wp[0]]
            this.previousSym= symbolCombination[0][wp[0]]

            //TODO: make win object which will be returned to gc. 
            for(let j= 1; j < wp.length; j++){
                if(this.isMatching(symbolCombination[j][wp[j]])){

                    if (this.symOfCurrentLine !== this.previousSym){
                        this.symOfCurrentLine= this.previousSym

                    }
                }
                else{
                    break;
                }
            }
        }
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
export { winCalculator }