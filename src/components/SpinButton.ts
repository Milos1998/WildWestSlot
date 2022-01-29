import { Graphics, Sprite, TextStyle, Text, Texture } from "pixi.js";
import { BUTTONS_FRAME_COLOR, BUTTONS_FRAME_THICKNESS, BUTTON_DECORATION_ACTIVE_COLOR, BUTTON_DECORATION_INACTIVE_COLOR, DISPLAYS_FONT_FAMILY, SPIN_BUTTON_ACTIVE_COLOR, SPIN_BUTTON_INACTIVE_TINT } from "../constants/constants";
import { gameController } from "../logic/GameController";

let descriptionStyle= new TextStyle({
    fill: 0xFFFFFF,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 24,
})

export class SpinButton extends Graphics{
    private image:Sprite
    private description: Text

    constructor(_x: number, _y: number, size: number){
        super()

        //draw button
        this.x= _x
        this.y= _y
        this.clear()
        this.beginFill(SPIN_BUTTON_ACTIVE_COLOR)
        this.lineStyle(BUTTONS_FRAME_THICKNESS, BUTTONS_FRAME_COLOR)
        this.drawRoundedRect(0, 0, size, size, 15)
        this.endFill()

        //set image
        this.image= Sprite.from('spin')
        this.image.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.image.x= size*0.5 + BUTTONS_FRAME_THICKNESS
        this.image.y= size*0.37
        this.image.anchor.set(0.5, 0.5)
        this.addChild(this.image)

        //set text
        this.description= new Text("SPIN", descriptionStyle)
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.description.y= this.height - this.description.height*2/3 - BUTTONS_FRAME_THICKNESS
        this.description.x= size/2
        this.description.anchor.set(0.5, 0.5)
        this.addChild(this.description)

        //add functionality
        this.addListener("pointertap", e => gameController.spinManually())
        this.interactive= true        
    }

    public setStateNeutral(){
        this.tint= 0xFFFFFF

        this.image.texture= Texture.from("spin")
        this.image.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.image.alpha= 1

        this.description.text= "SPIN"
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.description.y= this.height - this.description.height*2/3 - BUTTONS_FRAME_THICKNESS

        this.interactive= true
    }

    public setStateSkip(){
        this.tint= 0xFFFFFF
        
        this.image.texture= Texture.from("skip-animation")
        this.image.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.image.alpha= 1

        this.description.text= "SKIP"
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.description.y= this.height - this.description.height*2/3 - BUTTONS_FRAME_THICKNESS

        this.interactive= true
    }

    public setStateDisabledSkip(){
        this.tint= SPIN_BUTTON_INACTIVE_TINT

        this.image.texture= Texture.from("skip-animation")
        this.image.tint= BUTTON_DECORATION_INACTIVE_COLOR
        this.image.alpha= 1

        this.description.text= "SKIP"
        this.description.tint= BUTTON_DECORATION_INACTIVE_COLOR
        this.description.y= this.height - this.description.height*2/3 - BUTTONS_FRAME_THICKNESS

        this.interactive= false
    }

    public setStateCollect(){
        this.tint= 0xFFFFFF

        this.image.alpha= 0
        
        this.description.text= "COLLECT"
        this.description.tint= BUTTON_DECORATION_ACTIVE_COLOR
        this.description.y= this.height/2
        
        this.interactive= true
    }
}