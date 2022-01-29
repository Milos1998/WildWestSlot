import { Graphics, Sprite, TextStyle, Text } from "pixi.js";
import { AUTO_SPIN_BUTTON_OFF_COLOR, AUTO_SPIN_BUTTON_OFF_INACTIVE_TINT, AUTO_SPIN_BUTTON_ON_COLOR, BUTTONS_FRAME_COLOR, BUTTONS_FRAME_THICKNESS, BUTTON_DECORATION_ACTIVE_COLOR, BUTTON_DECORATION_INACTIVE_COLOR, DISPLAYS_FONT_FAMILY } from "../constants/constants";
import { dataController } from "../logic/DataController";
import { gameController } from "../logic/GameController";

let descriptionStyle= new TextStyle({
    fill: 0xFFFFFF,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 15,
})

export class AutoSpinButton extends Graphics{
    private image:Sprite
    private description: Text

    private size: number
    constructor(_x: number, _y: number, size: number){
        super()

        //draw button
        this.beginFill(AUTO_SPIN_BUTTON_OFF_COLOR)
        this.lineStyle(BUTTONS_FRAME_THICKNESS, BUTTONS_FRAME_COLOR)
        this.drawRoundedRect(0, 0, size, size, 15)
        this.x= _x
        this.y= _y
        this.size= size

        this.endFill()

        //set image
        this.image= Sprite.from('auto-spin')
        this.image.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.image.x= size*0.5
        this.image.y= size*0.37
        this.image.anchor.set(0.5, 0.5)
        this.addChild(this.image)

        //set text
        this.description= new Text("Auto: off", descriptionStyle)
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.description.y= size - this.description.height - 10
        this.description.x= size/2
        this.description.anchor.set(0.5, 0)
        this.addChild(this.description)

        //functionality
        dataController
        this.on("pointertap", e => {gameController.spinAutomatiaclly()
        console.log('is AS');
        })
        this.interactive= true
    }

    public setStateOn(){
        this.description.text= "Auto: on"
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR

        this.image.tint= BUTTON_DECORATION_ACTIVE_COLOR

        this.reDrawRec(AUTO_SPIN_BUTTON_ON_COLOR)
        this.tint= 0xFFFFFF

        this.interactive= true
    }

    public setStateOffEnabled(){
        this.description.text= "Auto: off"
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR

        this.image.tint= BUTTON_DECORATION_ACTIVE_COLOR

        this.reDrawRec(AUTO_SPIN_BUTTON_OFF_COLOR)
        this.tint= 0xFFFFFF

        this.interactive= true
    }

    public setStateOffDisabled(){
        this.description.text= "Auto: off"
        this.description.tint= BUTTON_DECORATION_INACTIVE_COLOR

        this.image.tint= BUTTON_DECORATION_INACTIVE_COLOR

        this.reDrawRec(AUTO_SPIN_BUTTON_OFF_COLOR)
        this.tint= AUTO_SPIN_BUTTON_OFF_INACTIVE_TINT

        this.interactive= false
    }

    private reDrawRec(fillColor: number){
        this.clear()
        this.beginFill(fillColor)
        this.lineStyle(BUTTONS_FRAME_THICKNESS, BUTTONS_FRAME_COLOR)
        this.drawRoundedRect(0, 0, this.size, this.size, 15)
        this.endFill()
    }
}