import { Symbols } from '../constants/winLinesData'

export const ASSETS = [
    //names of stripes must be same as names in winLinesData.ts Symbols object
    { name: Symbols.Reward1000, url: './assets/reward1000.png', stripe: true },
    { name: Symbols.Wild, url: './assets/wild.png', stripe: true },
    { name: Symbols.Sherif, url: './assets/sherif.png', stripe: true },
    { name: Symbols.Diamonds, url: './assets/diamonds.jpg', stripe: true },
    { name: Symbols.Hearts, url: './assets/hearts.jpg', stripe: true },
    { name: Symbols.Spades, url: './assets/spades.png', stripe: true },
    { name: Symbols.Clubs, url: './assets/clubs.jpg', stripe: true },
    { name: Symbols.A, url: './assets/A.jpg', stripe: true },
    { name: Symbols.K, url: './assets/K.jpg', stripe: true },
    { name: Symbols.Q, url: './assets/Q.jpg', stripe: true },
    { name: Symbols.J, url: './assets/J.jpg', stripe: true },
    { name: Symbols.TEN, url: './assets/10.jpg', stripe: true },
    { name: Symbols.NINE, url: './assets/9.jpg', stripe: true },
    { name: 'background', url: './assets/background.jpg' },
    { name: 'bonus mode background', url: './assets/bonus spin background.jpg' },
    { name: 'plus', url: './assets/plus.png' },
    { name: 'minus', url: './assets/minus.png' },
    { name: 'skip-animation', url: './assets/skip-animation.png' },
    { name: 'spin', url: './assets/spin.png' },
    { name: 'auto-spin', url: './assets/auto-spin.png' },
    { name: 'info', url: './assets/information.png' },
    { name: 'reel stopping', url: './assets/reel stop short.mp3', preload: true },
    { name: 'coin drop long', url: './assets/coin drop long1.mp3', preload: true },
    { name: 'specials theme', url: './assets/The good the bad and the ugly - short.mp3', preload: true },
    { name: 'background sound', url: './assets/Maple Leaf Rag.mp3', preload: true }
]
