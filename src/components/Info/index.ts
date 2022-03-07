import { Sprite, Texture } from 'pixi.js'
import { ASSETS } from '../../assets'
import { APP_WIDTH, INFO_BUTTON_PADDING } from '../../constants'
import { PAYTABLE, Symbols } from '../../constants/winLinesData'
import dataController from '../../logic/DataController'
import { makeImage, makeSpan } from '../../utils/htmlUtils'

export class Info extends Sprite {
    private timeoutId = 0
    private pointerHoldActive = false
    private filterDisplayed = false
    private infoDisplayed = false
    private symbolsData: { url: string; name: string; included: boolean; payouts: number[] }[] = []

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
                    included: dataController.getStripeSymbols().indexOf(asset.name) !== -1,
                    payouts: [
                        ...(PAYTABLE.find((item) => item.symbol === asset.name) as typeof PAYTABLE[0]).payoutPerMatch
                    ]
                })
        })
        this.symbolsData.forEach((sym) => {
            sym.payouts = sym.payouts.sort((p1, p2) => p2 - p1)
        })
    }

    private initFilter() {
        const filterItemsContainer = document.getElementById('filter-items')

        for (const symbol of this.symbolsData) {
            const img = makeImage(symbol.url)
            filterItemsContainer?.appendChild(img)

            if (!symbol.included) img.classList.add('filteredImg')

            img.onclick = () => {
                symbol.included = !symbol.included
                img.style.opacity = symbol.included ? '1' : '0.2'
                dataController.filterStripeSymbols(symbol.name, symbol.included)
            }
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
        this.editSpecialsImages()
        const payTableContainer = document.getElementById('pay-table') as HTMLElement

        for (const symbol of this.symbolsData) {
            const img = makeImage(symbol.url)
            payTableContainer.appendChild(img)
            img.classList.add(...['pay-table-item'])
            symbol.payouts.forEach((payout) => {
                payTableContainer.appendChild(makeSpan(payout > 0 ? payout.toString() : ' ', 'pay-table-item'))
            })
        }

        const closeButton = document.getElementById('info-button') as HTMLElement
        closeButton.onclick = () => this.displayInfo(false)
    }

    private editSpecialsImages() {
        const wildImg = document.getElementById('wild-img')
        const specialImg = document.getElementById('special-img')

        this.symbolsData.forEach((symbol) => {
            if (symbol.name === Symbols.Wild) wildImg?.setAttribute('src', symbol.url)
            if (symbol.name === Symbols.Reward1000) specialImg?.setAttribute('src', symbol.url)
        })
    }

    private displayInfo(displayed: boolean) {
        this.infoDisplayed = displayed
        const infoContainer = document.getElementById('info') as HTMLElement
        infoContainer.style.display = this.infoDisplayed ? 'block' : 'none'
    }
}
