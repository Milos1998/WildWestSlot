import { Graphics, Sprite, Text, TextStyle } from 'pixi.js'
import {
    APP_HEIGHT,
    APP_WIDTH,
    DISPLAYS_FONT_FAMILY,
    DISPLAYS_FONT_FILL,
    MODAL_FILTER_BUTTON_COLOR,
    MODAL_FILTER_BUTTON_DISABLED_TINT,
    MODAL_FILTER_BUTTON_HEIGHT,
    MODAL_FILTER_BUTTON_WIDTH,
    MODAL_FILTER_BUTTON_X,
    MODAL_FILTER_BUTTON_Y,
    MODAL_FILTER_DISCARTED_ITEM_TINT,
    MODAL_FILTER_ITEM_SCALE,
    MODAL_FILTER_PADDING,
    MODAL_FILTER_ROWS,
    MODAL_FILTER_SELECTED_ITEM_TINT,
    MODAL_FILTER_TITLE_X,
    MODAL_FILTER_TITLE_Y,
    MODAL_FILTER_X,
    MODAL_FILTER_Y
} from '../../constants'
import dataController from '../../logic/DataController'

const titleStyle = new TextStyle({
    fill: DISPLAYS_FONT_FILL,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 30
})

const buttonStyle = new TextStyle({
    fill: DISPLAYS_FONT_FILL,
    fontFamily: DISPLAYS_FONT_FAMILY,
    fontSize: 20
})

export class Modal extends Graphics {
    private filter: Graphics = new Graphics()
    private filterItems: Map<string, Sprite> = new Map()
    private removed: string[] = []
    private toFilter = ''
    private filterButton: Graphics = new Graphics()
    private filterPromise!: (value: unknown) => void

    constructor() {
        super()

        this.beginFill(0, 0.9)
        this.drawRect(0, 0, APP_WIDTH, APP_HEIGHT)
        this.endFill()

        this.interactive = true
        this.visible = false

        this.addChild(this.filter)
        this.initFilter()
    }

    private initFilter() {
        const title = new Text('Eliminate one symbol', titleStyle)
        this.filter.addChild(title)
        title.x = MODAL_FILTER_TITLE_X
        title.y = MODAL_FILTER_TITLE_Y
        title.anchor.set(0.5)

        this.initFilterItems()
        this.initFilterButton()
    }

    private initFilterItems() {
        dataController.getStripeSymbols(false).map((sym, ind) => {
            const sprite = Sprite.from(sym)
            this.filter.addChild(sprite)

            sprite.scale.set(MODAL_FILTER_ITEM_SCALE)
            sprite.y = MODAL_FILTER_Y + Math.floor(ind / MODAL_FILTER_ROWS) * (sprite.height + MODAL_FILTER_PADDING)
            sprite.x = MODAL_FILTER_X + (ind % MODAL_FILTER_ROWS) * (sprite.width + MODAL_FILTER_PADDING)

            sprite.interactive = true
            sprite.on('pointertap', () => {
                this.filterButton.interactive = true
                this.filterButton.tint = 0xffffff
                if (this.toFilter != '') {
                    const previousSelected = this.filterItems.get(this.toFilter)
                    if (!previousSelected) throw new Error('missing stripe')
                    previousSelected.tint = 0xffffff
                }
                sprite.tint = MODAL_FILTER_SELECTED_ITEM_TINT
                this.toFilter = sym
            })

            this.filterItems.set(sym, sprite)
        })
    }

    private initFilterButton() {
        this.filterButton.beginFill(MODAL_FILTER_BUTTON_COLOR)
        this.filterButton.drawRect(0, 0, MODAL_FILTER_BUTTON_WIDTH, MODAL_FILTER_BUTTON_HEIGHT)
        this.filterButton.endFill()
        this.filterButton.tint = MODAL_FILTER_BUTTON_DISABLED_TINT
        this.filterButton.position.set(MODAL_FILTER_BUTTON_X, MODAL_FILTER_BUTTON_Y)

        this.filterButton.on('pointertap', () => {
            this.removed.push(this.toFilter)
            dataController.filterStripeSymbols(this.toFilter, false)
            this.toFilter = ''
            this.filterButton.tint = MODAL_FILTER_BUTTON_DISABLED_TINT
            this.filterButton.interactive = false
            this.filterPromise(true)
            this.hideFilter()
        })
        this.filter.addChild(this.filterButton)

        const text = new Text('ok', buttonStyle)
        this.filterButton.addChild(text)
        text.x = (this.filterButton.width - text.width) / 2
        text.y = (this.filterButton.height - text.height) / 2
    }

    public async displayFilter() {
        this.visible = true
        this.filter.visible = true

        this.filterItems.forEach((sprite, sym) => {
            if (dataController.getStripeSymbols().indexOf(sym) !== -1) {
                sprite.tint = 0xffffff
                sprite.interactive = true
            } else {
                sprite.tint = MODAL_FILTER_DISCARTED_ITEM_TINT
                sprite.interactive = false
            }
        })

        return new Promise((resolve) => {
            this.filterPromise = resolve
        })
    }

    private hideFilter() {
        this.filter.visible = false
        this.visible = false
    }

    public resetFilter() {
        this.toFilter = ''
        this.removed.forEach((sym) => dataController.filterStripeSymbols(sym, true))
        this.filterItems.forEach((sprite) => (sprite.interactive = true))
    }
}
