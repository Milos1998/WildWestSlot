import { Application } from "pixi.js";
import * as PIXI from "pixi.js"     //for gsap
import { SlotMachine } from "../components/SlotMachine";
import { AssetLoader } from "./AssetLoader";
import { dataController } from "./DataController";
import { gsap } from "gsap"
import { PixiPlugin } from "gsap/PixiPlugin"
import { winCalculator } from "./WinCalculator";

//Syncs processes of the game
class GameController{
    private app: Application= undefined as any
    private slotMachine: SlotMachine= undefined as any

    constructor(){
    }

    public initGameController(_app: Application){
        this.app= _app
        const loader: AssetLoader= new AssetLoader()

        this.app.stage.addChild(loader)
    }

    //get's called from Loader when caching is finished 
    public initGameElements(){
        PixiPlugin.registerPIXI(PIXI)
        gsap.registerPlugin(PixiPlugin)

        this.slotMachine= new SlotMachine()
        this.app.stage.addChild(this.slotMachine)
    }

    //controlling selectors
    public increaseNumberOfLines(){
        let newNumOfLines= dataController.incrementNumberOfLines()

        //set correct states for buttons
        if(newNumOfLines === dataController.getMaxNumberOfLines())
            this.slotMachine.linesSelector.disableMoreButton()
        this.slotMachine.linesSelector.enableLessButton()

        //set states for displays        
        this.slotMachine.linesSelector.setDisplayValue(newNumOfLines)
        this.slotMachine.totalBetDisplay.setDisplayValue((Math.round(dataController.getTotalBet()*100)/100))

        //display lines
        this.slotMachine.winLines.displayOnlySelectedLines()
    }

    public decreaseNumberOfLines(){
        let newNumOfLines= dataController.decrementNumberOfLines()

        //set correct states for buttons
        if(newNumOfLines === 1)
            this.slotMachine.linesSelector.disableLessButton()
        this.slotMachine.linesSelector.enableMoreButton()
        
        //set states for displays        
        this.slotMachine.linesSelector.setDisplayValue(newNumOfLines)
        this.slotMachine.totalBetDisplay.setDisplayValue((Math.round(dataController.getTotalBet()*100)/100))

        //display lines
        this.slotMachine.winLines.displayOnlySelectedLines()
    }

    public increaseBet(){
        let newBet= dataController.incrementBet()

        //set correct states for buttons
        if(newBet === dataController.getMaxBet())
            this.slotMachine.betSelector.disableMoreButton()
        this.slotMachine.betSelector.enableLessButton()

        //set states for displays
        this.slotMachine.betSelector.setDisplayValue(newBet)
        this.slotMachine.totalBetDisplay.setDisplayValue((Math.round(dataController.getTotalBet()*100)/100))

        //hide winLines
        this.slotMachine.winLines.hideAllLines()
    }

    public decreaseBet(){        
        let newBet= dataController.decrementBet()

        //set correct states for buttons
        if(newBet === dataController.getMinBet())
            this.slotMachine.betSelector.disableLessButton()
        this.slotMachine.betSelector.enableMoreButton()

        //set states for displays
        this.slotMachine.betSelector.setDisplayValue(newBet)
        this.slotMachine.totalBetDisplay.setDisplayValue((Math.round(dataController.getTotalBet()*100)/100))

        //hide winLines
        this.slotMachine.winLines.hideAllLines()
    }

    public skipSpinAnimation(){
        dataController.animationSequencer.seek("endAnimation")
    }

    public collectCash(){
        //TODO

    }

    public spinAutomatiaclly(){
        //TODO
        dataController.reverseAutoSpinActivated()
    }

    public async spinManually(){
        this.slotMachine.autoSpinButton.setStateOffDisabled()
        this.slotMachine.spinButton.setStateSkip()
        this.slotMachine.betSelector.disableSelector()
        this.slotMachine.linesSelector.disableSelector()
        this.slotMachine.winLines.hideAllLines()

        this.slotMachine.reelsHolder.spinReels()
        //I have to use bind in setStateDisabledSkip because we don't know context for this, because I'm not initing slotMachine from constructor because of loader  //TODO: fix if possible
        dataController.animationSequencer.call(this.slotMachine.spinButton.setStateDisabledSkip.bind(this.slotMachine.spinButton), undefined, "endAnimation")
        await dataController.animationSequencer.play().then(()=>{dataController.animationSequencer.clear()})

        //TODO odradi winline da racuna dobitak.
        winCalculator.calculateWin(this.slotMachine.reelsHolder.getSymbolsCombination())


        this.slotMachine.autoSpinButton.setStateOffEnabled()
        this.slotMachine.spinButton.setStateNeutral()
        this.slotMachine.betSelector.enableSelector()
        this.slotMachine.linesSelector.enableSelector()
    }

    private spin(){
        console.log('spin');
    }
}

let gameController: GameController= new GameController()
export {gameController}