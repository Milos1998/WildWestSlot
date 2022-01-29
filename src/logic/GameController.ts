import { Application } from "pixi.js";
import * as PIXI from "pixi.js"     //for gsap
import { SlotMachine } from "../components/SlotMachine";
import { AssetLoader } from "./AssetLoader";
import { dataController } from "./DataController";
import { gsap } from "gsap"
import { PixiPlugin } from "gsap/PixiPlugin"
import { REEL_SPIN_MID_ROTATION, REEL_SPIN_START_ROTATION } from "../constants/constants";

//Syncs processes of the game
class GameController{
    private app: Application= undefined as any
    private slotMachine: SlotMachine= undefined as any

    constructor(){      //we are using GameController as if it was static class

    }

    public initGameController(_app: Application){
        this.app= _app
        const loader: AssetLoader= new AssetLoader()

        this.app.stage.addChild(loader)
    }

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

    public spinAutomatiaclly(){
        dataController.reverseAutoSpinActivated()

//        dataController.animationSequencer.seek(REEL_SPIN_START_ROTATION + REEL_SPIN_MID_ROTATION)
    }

    public async spinManually(){
        this.slotMachine.autoSpinButton.setStateOffDisabled()
        this.slotMachine.spinButton.setStateSkip()
        this.slotMachine.betSelector.disableSelector()
        this.slotMachine.linesSelector.disableSelector()
        this.slotMachine.winLines.hideAllLines()

        this.slotMachine.reelsHolder.spinReels()
        await dataController.animationSequencer.play().then(()=>{dataController.animationSequencer.clear()})

        //TODO sredi dugme da prati animaciju i odradi winline da racuna dobitak.

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