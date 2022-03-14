import gsap from 'gsap/all'
import { Graphics, Sprite, TextStyle, Text } from 'pixi.js'
import {
    DISPLAYS_COLOR,
    DISPLAYS_FRAME_COLOR,
    DISPLAYS_FRAME_THICKNESS,
    DISPLAYS_FONT_FAMILY,
    DISPLAYS_FONT_FILL,
    DISPLAYS_DISABLED_BUTTON_COLOR
} from '../../constants'

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
    private _displayValue: Text
    private _moreButton: Sprite | undefined = undefined
    private _lessButton: Sprite | undefined = undefined
    private wasMoreActive = false
    private wasLessActive = false
    private wasDisabledBefore = false
    private mainTimeline: gsap.core.Timeline

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

        this._displayValue = new Text(_displayValue, displayValueStyle)
        this._displayValue.anchor.set(0.5, 0.5)
        this._displayValue.x = this.width / 2
        this._displayValue.y = (this.height * 4) / 13

        this.addChild(this.description, this._displayValue)

        if (isSelector) this.initSelectorButtons()
        this.mainTimeline = gsap.timeline()
    }

    set displayValue(newDisplayValue: string | number) {
        if (typeof newDisplayValue === 'number') newDisplayValue = (Math.round(newDisplayValue * 100) / 100).toString()
        this._displayValue.text = newDisplayValue
    }

    get lessButton() {
        if (!this._lessButton) throw new Error('missing less button')
        return this._lessButton
    }

    get moreButton() {
        if (!this._moreButton) throw new Error('missing more button')
        return this._moreButton
    }

    public disableLessButton() {
        if (!this._lessButton) throw new Error('missing less button')
        this._lessButton.interactive = false
        this._lessButton.tint = DISPLAYS_DISABLED_BUTTON_COLOR
    }

    public enableLessButton() {
        if (!this._lessButton) throw new Error('missing less button')
        this._lessButton.interactive = true
        this._lessButton.tint = 0xffffff
    }

    public disableMoreButton() {
        if (!this._moreButton) throw new Error('missing more button')
        this._moreButton.interactive = false
        this._moreButton.tint = DISPLAYS_DISABLED_BUTTON_COLOR
    }

    public enableMoreButton() {
        if (!this._moreButton) throw new Error('missing more button')
        this._moreButton.interactive = true
        this._moreButton.tint = 0xffffff
    }

    public disableSelector() {
        if (!this._moreButton || !this._lessButton) throw new Error('missing buttons')

        if (!this.wasDisabledBefore) this.wasLessActive = this._lessButton.interactive
        this.disableLessButton()
        if (!this.wasDisabledBefore) this.wasMoreActive = this._moreButton.interactive
        this.disableMoreButton()
        this.wasDisabledBefore = true
    }

    public enableSelector() {
        if (this.wasLessActive) this.enableLessButton()
        if (this.wasMoreActive) this.enableMoreButton()
        this.wasDisabledBefore = false
    }

    private initSelectorButtons() {
        this._lessButton = Sprite.from('minus')
        this._lessButton.anchor.set(0, 0.5)
        this._lessButton.x = 8 - DISPLAYS_FRAME_THICKNESS
        this._lessButton.y = this.height / 2 - DISPLAYS_FRAME_THICKNESS
        this.interactive = true
        this.addChild(this._lessButton)

        this._moreButton = Sprite.from('plus')
        this._moreButton.anchor.set(1, 0.5)
        this._moreButton.x = this.width - 8
        this._moreButton.y = this.height / 2 - DISPLAYS_FRAME_THICKNESS
        this.interactive = true
        this.addChild(this._moreButton)
    }

    public queueDisplayValueChangeAnimation(newValue: number, duration: number, sound: () => void) {
        this.mainTimeline = gsap.timeline()

        this.mainTimeline.to(this._displayValue, {
            pixi: { text: newValue },
            duration: duration,
            onUpdate: function () {
                const fixedPositions = newValue % 1 === 0 ? 0 : 2
                this.targets()[0].text = Number.parseFloat(this.targets()[0].text).toFixed(fixedPositions).toString()
            }
        })

        this.mainTimeline.call(sound, undefined, 0)

        return this.mainTimeline
    }

    public stopDisplayValueChangeAnimation() {
        this.mainTimeline.progress(1)
        this.resetMainTimeline()
    }

    private resetMainTimeline() {
        this.mainTimeline.kill()
        this.mainTimeline = gsap.timeline()
    }
}
