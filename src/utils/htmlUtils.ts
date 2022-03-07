export function makeImage(url: string) {
    const img = document.createElement('img')
    img.setAttribute('src', url)

    return img
}

export function makeSpan(text: string, addClass?: string) {
    const span = document.createElement('span')
    span.innerText = text
    if (addClass) span.classList.add(...[addClass])

    return span
}
