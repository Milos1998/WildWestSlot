import { Sprite, Texture } from "pixi.js";
import dataController from "../logic/DataController";

export default class Stripe extends Sprite{
    private static stripeSymbols: string[]= dataController.getStripeSymbols()
    private symbol= ""

    constructor(x: number, y: number, width: number, height: number, textureSource: string= ""){
        super()
        
        this.x= x
        this.y= y
        this.width= width
        this.height= height
        this.visible= true
        
        this.setSymbol(textureSource)
    }

    private randomSymbolSelection(){    //TODO napravi ovo da radi tako sto ce da vadi iz niza simbola ili sta god
        let symbolNum= Math.floor(Math.random() * Stripe.stripeSymbols.length)
        return Stripe.stripeSymbols[symbolNum]
    }

    public setSymbol(textureSource: string= ""){
        if(textureSource === "")
            textureSource= this.randomSymbolSelection()
        
        this.symbol= textureSource
        this.texture= Texture.from(textureSource)
    }

    public getSymbol(){
        return this.symbol
    }
}