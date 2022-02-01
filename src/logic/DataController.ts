import { gsap } from "gsap"
import { ASSETS } from "../assets/assets"
import { BETS, SpinBtnState, STARTING_BALANCE } from "../constants/constants"
import { WIN_LINES_DATA } from "../constants/winLinesData"

export class DataController{
    private stripeSymbols: string[]= this.initStripeSymbols()
    private numberOfLines= WIN_LINES_DATA.length
    private selectedBetOption= 3
    private balance= STARTING_BALANCE
    private spinBtnState= SpinBtnState.Neutral
    private autoSpinActivated= false
    public animationSequencer

    constructor(){
        this.animationSequencer= gsap.timeline()
    }

    public getStripeSymbols(){
        return this.stripeSymbols
    }

    private initStripeSymbols(){
        let tmp: string[]= []
        ASSETS.forEach((el) => {
            if(el.stripe)
                tmp.push(el.name)
        })
        return tmp
    }

    public getMaxNumberOfLines(){
        return WIN_LINES_DATA.length
    }

    public getNumberOfLines(){
        return this.numberOfLines
    }

    public decrementNumberOfLines(){
        if(this.numberOfLines > 1)
            this.numberOfLines--
        return this.numberOfLines
    }

    public incrementNumberOfLines(){
        if(this.numberOfLines < WIN_LINES_DATA.length)
            this.numberOfLines++
        return this.numberOfLines
    }

    public getBet(){
        return BETS[this.selectedBetOption]
    }

    public getTotalBet(){
        return this.numberOfLines * this.getBet()
    }

    public decrementBet(){
        if(this.selectedBetOption > 0)
            this.selectedBetOption--
        return BETS[this.selectedBetOption]
    }

    public incrementBet(){
        if(this.selectedBetOption < BETS.length - 1)
            this.selectedBetOption++
        return BETS[this.selectedBetOption]
    }

    public getMaxBet(){
        return BETS[BETS.length-1]
    }

    public getMinBet(){
        return BETS[0]
    }

    public getBalance(){
        return this.balance
    }

    public setSpinBtnState(state: SpinBtnState){
        this.spinBtnState= state
    }

    public getSpinBtnState(){
        return this.spinBtnState
    }

    public reverseAutoSpinActivated(){
        this.autoSpinActivated= !this.autoSpinActivated
    }

    public isAutoSpinActivated(){
        return this.autoSpinActivated
    }
}

let dataController: DataController= new DataController()
export { dataController }