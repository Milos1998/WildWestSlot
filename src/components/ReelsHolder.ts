import { Container, Graphics } from "pixi.js";
import { REELS_HOLDER_FRAME_THICKNESS, REELS_PER_REEL_HOLDER, REEL_HEIGHT, REEL_SPIN_DELAY, REEL_SPIN_END_ROTATION, REEL_SPIN_MID_ROTATION, REEL_SPIN_START_ROTATION, REEL_WIDTH, STRIPE_SIZE } from "../constants/constants";
import dataController from "../logic/DataController";
import Reel from "./Reel";

export default class ReelsHolder extends Container{
    private reels: Reel[]

    constructor(x: number, y: number, width: number, height: number){
        super()

        this.x= x
        this.y= y

        //frame
        let frame= new Graphics()
        frame.beginFill(0x0)
        frame.drawRect(-REELS_HOLDER_FRAME_THICKNESS, -REELS_HOLDER_FRAME_THICKNESS, width, height)
        frame.endFill()
        this.addChild(frame)

        this.reels= []
        for(let i= 0; i < REELS_PER_REEL_HOLDER; i++){
            this.reels.push(new Reel(i*(STRIPE_SIZE + REELS_HOLDER_FRAME_THICKNESS), 0, REEL_WIDTH, REEL_HEIGHT))
            this.addChild(this.reels[i])
        }

        this.makeReelsPretty()
    }

    private makeReelsPretty(){
        let symbols= dataController.getStripeSymbols()
        for(let i= 0; i < this.reels.length; i++){
            this.reels[i].makeAllStripesIdentical(symbols[i])
        }
    }

    public spinReels(){
        dataController.animationSequencer.addLabel("spinReels")

        for(let i= 0; i < this.reels.length; i++){
            dataController.animationSequencer.add(this.reels[i].spinReel(), `<${REEL_SPIN_DELAY}`)
        }

        dataController.animationSequencer.addLabel("endAnimation", REEL_SPIN_START_ROTATION + REEL_SPIN_MID_ROTATION)
        dataController.animationSequencer.pause()
    }

    public getSymbolsCombination(){
        let symCombination= []
        for(let i= 0; i < this.reels.length; i++){
            symCombination.push(this.reels[i].getSymbols())
        }

        return symCombination
    }
}