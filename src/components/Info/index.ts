import { Sprite, Texture } from 'pixi.js'
import { ASSETS } from '../../assets'
import { APP_WIDTH, INFO_BUTTON_PADDING } from '../../constants'
import dataController from '../../logic/DataController'
import { makeImage } from './htmlUtils'

export class Info extends Sprite {
    private timeoutId = 0
    private filterDisplayed = false
    private infoDisplayed = false
    private pointerHoldActive = false
    private symbolsData: { url: string; name: string; included: boolean }[] = []

    constructor() {
        super()

        this.texture = Texture.from('info')
        this.x = APP_WIDTH - INFO_BUTTON_PADDING
        this.y = INFO_BUTTON_PADDING
        this.anchor.set(1, 0)
        this.interactive = true

        this.on('pointerdown', () => this.mouseHold())
        this.on('pointerup', () => this.cancelHold(true))
        this.on('pointerout', () => this.cancelHold(false))

        this.initSymbolsData()
        this.initFilter()
        this.initInfo()

        this.displayFilter(false)
        this.displayInfo(false)
    }

    private mouseHold() {
        const holdDuration = 1000

        this.pointerHoldActive = true
        this.timeoutId = setTimeout(() => {
            this.displayFilter(true)
            this.pointerHoldActive = false
        }, holdDuration) as unknown as number
    }

    private cancelHold(isClick: boolean) {
        if (!this.pointerHoldActive) return
        clearTimeout(this.timeoutId)
        if (isClick) this.displayInfo(true)
    }

    private initSymbolsData() {
        ASSETS.forEach((asset) => {
            if (asset.stripe)
                this.symbolsData.push({
                    url: asset.url,
                    name: asset.name,
                    included: true
                })
        })
    }

    private initFilter() {
        const filterItemsContainer = document.getElementById('filter-items')

        for (const symbol of this.symbolsData) {
            const img = makeImage(symbol.url)

            if (dataController.getStripeSymbols().indexOf(symbol.name) === -1) {
                img.classList.add('filteredImg')
                symbol.included = false
            }
            img.onclick = () => {
                img.classList.toggle('filteredImg')
                symbol.included = !symbol.included
                dataController.filterStripeSymbols(symbol.name, symbol.included)
            }
            filterItemsContainer?.appendChild(img)
        }
        const closeButton = document.getElementById('filter-button') as HTMLElement
        closeButton.onclick = () => this.displayFilter(false)
    }

    private displayFilter(displayed: boolean) {
        this.filterDisplayed = displayed
        const filterContainer = document.getElementById('filter') as HTMLElement
        filterContainer.style.display = this.filterDisplayed ? 'block' : 'none'
    }

    private initInfo() {
        const infoItemsContainer = document.getElementById('info-items') as HTMLElement

        for (const symbol of this.symbolsData) {
            const img = makeImage(symbol.url)
            infoItemsContainer.appendChild(img)
        }

        const closeButton = document.getElementById('info-button') as HTMLElement
        closeButton.onclick = () => this.displayInfo(false)
    }

    private displayInfo(displayed: boolean) {
        this.infoDisplayed = displayed
        const infoContainer = document.getElementById('info') as HTMLElement
        infoContainer.style.display = this.infoDisplayed ? 'block' : 'none'
    }
}
