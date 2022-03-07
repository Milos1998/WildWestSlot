import { Texture } from 'pixi.js'

export function gradient(start: string, middle: string, end: string) {
    const c = document.createElement('canvas')
    const ctx = c.getContext('2d')
    if (ctx === null) return Texture.WHITE
    const grd = ctx.createLinearGradient(0, 0, 100, 100)
    grd.addColorStop(0, start)
    grd.addColorStop(0.5, middle)
    grd.addColorStop(1, end)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 100, 100)
    return Texture.from(c)
}
