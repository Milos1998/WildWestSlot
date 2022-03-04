export function makeImage(url: string) {
    const img = document.createElement('img')
    img.setAttribute('src', url)

    return img
}

export function makeHorizontalFlexbox() {
    const div = document.createElement('div')
    div.classList.add(...['flex-container', 'horizontal'])

    return div
}
