import { Container, Graphics } from "pixi.js";
import { REELS_HOLDER_FRAME_THICKNESS, STRIPE_SIZE, WIN_LINE_THICKNESS } from "../constants/constants";
import { LINE_COLORS, LINE_OFFSETS, WIN_LINES_DATA } from "../constants/winLinesData";
import dataController from "../logic/DataController";

export default class WinLines extends Container{
    private lines: Graphics[]= []
    constructor(x: number, y: number, width: number, height: number){
        super()

        this.x= x-REELS_HOLDER_FRAME_THICKNESS
        this.y= y
        this.width= width
        this.height= height

        for(let i= 0; i < WIN_LINES_DATA.length; i++){
            let wld= WIN_LINES_DATA[i]

            let line= new Graphics()
            this.lines.push(line)
            this.addChild(line)
            line.lineStyle(WIN_LINE_THICKNESS, LINE_COLORS[wld.lineGroup])

            let offsetY= STRIPE_SIZE/2 + LINE_OFFSETS[wld.lineGroup]
            let offsetX= STRIPE_SIZE/2 + REELS_HOLDER_FRAME_THICKNESS
            line.moveTo(0, wld.winPositions[0]*STRIPE_SIZE+ offsetY)
            let j
            for(j= 0; j < wld.winPositions.length; j++){
                offsetX+= REELS_HOLDER_FRAME_THICKNESS
                line.lineTo(j*STRIPE_SIZE + offsetX, wld.winPositions[j]*STRIPE_SIZE + offsetY)
            }
            j--
            line.lineTo((j)*STRIPE_SIZE + offsetX + 1/2*STRIPE_SIZE, wld.winPositions[j]*STRIPE_SIZE + offsetY)
        }

        this.hideAllLines()
    }

    public displayOnlySelectedLines(){
        let numSelectedLines= dataController.getNumberOfLines()
        for(let i= 0; i < this.lines.length; i++)
            if(i < numSelectedLines)
                this.lines[i].visible= true
            else
                this.lines[i].visible= false
    }

    public displayAllLines(){
        for(let i= 0; i < this.lines.length; i++)
            this.lines[i].visible= true
    }

    public hideAllLines(){
        for(let i= 0; i < this.lines.length; i++)
            this.lines[i].visible= false
    }

}