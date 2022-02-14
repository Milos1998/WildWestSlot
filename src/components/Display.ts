import { Graphics, Sprite, TextStyle, Text } from 'pixi.js'
import {
    DISPLAYS_COLOR,
    DISPLAYS_FRAME_COLOR,
    DISPLAYS_FRAME_THICKNESS,
    DISPLAYS_FONT_FAMILY,
    DISPLAYS_FONT_FILL,
    DISPLAYS_DISABLED_BUTTON_COLOR
} from '../constants/constants'

const descriptionStyle = new TextStyle({
    fill: DISPLAYS_FONT_FILL,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 12
})

const displayValueStyle = new TextStyle({
    fill: DISPLAYS_FONT_FILL,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 25
})

export default class Display extends Graphics {
    private description: Text
    private displayValue: Text

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public moreButton: Sprite = undefined as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public lessButton: Sprite = undefined as any

    private wasMoreActive = false
    private wasLessActive = false

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        _displayValue: string,
        _description: string,
        isSelector = false
    ) {
        super()

        this.x = x
        this.y = y

        this.beginFill(DISPLAYS_COLOR)
        this.lineStyle(DISPLAYS_FRAME_THICKNESS, DISPLAYS_FRAME_COLOR)
        this.drawRect(0, 0, width, height)
        this.endFill()

        this.description = new Text(_description, descriptionStyle)
        this.description.anchor.set(0.5, 0.5)
        this.description.x = this.width / 2
        this.description.y = (this.height * 9) / 13

        this.displayValue = new Text(_displayValue, displayValueStyle)
        this.displayValue.anchor.set(0.5, 0.5)
        this.displayValue.x = this.width / 2
        this.displayValue.y = (this.height * 4) / 13

        this.addChild(this.description, this.displayValue)

        if (isSelector) this.initSelectorButtons()
    }

    public setDisplayValue(newDisplayValue: string | number) {
        if (typeof newDisplayValue === 'number') newDisplayValue = (Math.round(newDisplayValue * 100) / 100).toString()
        this.displayValue.text = newDisplayValue
    }

    public disableLessButton() {
        this.lessButton.interactive = false
        this.lessButton.tint = DISPLAYS_DISABLED_BUTTON_COLOR
    }

    public enableLessButton() {
        this.lessButton.interactive = true
        this.lessButton.tint = 0xffffff
    }

    public disableMoreButton() {
        this.moreButton.interactive = false
        this.moreButton.tint = DISPLAYS_DISABLED_BUTTON_COLOR
    }

    public enableMoreButton() {
        this.moreButton.interactive = true
        this.moreButton.tint = 0xffffff
    }

    public disableSelector() {
        this.wasLessActive = this.lessButton.interactive
        this.disableLessButton()
        this.wasMoreActive = this.moreButton.interactive
        this.disableMoreButton()
    }

    public enableSelector() {
        if (this.wasLessActive) this.enableLessButton()
        if (this.wasMoreActive) this.enableMoreButton()
    }

    private initSelectorButtons() {
        this.lessButton = Sprite.from('minus')
        this.lessButton.anchor.set(0, 0.5)
        this.lessButton.x = 8 - DISPLAYS_FRAME_THICKNESS
        this.lessButton.y = this.height / 2 - DISPLAYS_FRAME_THICKNESS
        this.interactive = true
        this.addChild(this.lessButton)

        this.moreButton = Sprite.from('plus')
        this.moreButton.anchor.set(1, 0.5)
        this.moreButton.x = this.width - 8
        this.moreButton.y = this.height / 2 - DISPLAYS_FRAME_THICKNESS
        this.interactive = true
        this.addChild(this.moreButton)
    }
}
