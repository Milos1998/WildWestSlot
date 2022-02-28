import { STRIPE_SIZE } from './'

export const WIN_LINES_DATA = [
    {
        lineGroup: 0,
        lineMatrixBool: [
            [false, false, false, false, false],
            [true, true, true, true, true],
            [false, false, false, false, false]
        ],
        winPositions: [1, 1, 1, 1, 1]
    },
    {
        lineGroup: 0,
        lineMatrixBool: [
            [true, true, true, true, true],
            [false, false, false, false, false],
            [false, false, false, false, false]
        ],
        winPositions: [0, 0, 0, 0, 0]
    },
    {
        lineGroup: 0,
        lineMatrixBool: [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [true, true, true, true, true]
        ],
        winPositions: [2, 2, 2, 2, 2]
    },
    {
        lineGroup: 0,
        lineMatrixBool: [
            [true, false, false, false, true],
            [false, true, false, true, false],
            [false, false, true, false, false]
        ],
        winPositions: [0, 1, 2, 1, 0]
    },
    {
        lineGroup: 0,
        lineMatrixBool: [
            [false, false, true, false, false],
            [false, true, false, true, false],
            [true, false, false, false, true]
        ],
        winPositions: [2, 1, 0, 1, 2]
    },
    {
        lineGroup: 1,
        lineMatrixBool: [
            [true, true, false, false, false],
            [false, false, true, false, false],
            [false, false, false, true, true]
        ],
        winPositions: [0, 0, 1, 2, 2]
    },
    {
        lineGroup: 1,
        lineMatrixBool: [
            [false, false, false, true, true],
            [false, false, true, false, false],
            [true, true, false, false, false]
        ],
        winPositions: [2, 2, 1, 0, 0]
    },
    {
        lineGroup: 2,
        lineMatrixBool: [
            [false, true, false, false, false],
            [true, false, true, false, true],
            [false, false, false, true, false]
        ],
        winPositions: [1, 0, 1, 2, 1]
    },
    {
        lineGroup: 3,
        lineMatrixBool: [
            [false, false, false, true, false],
            [true, false, true, false, true],
            [false, true, false, false, false]
        ],
        winPositions: [1, 2, 1, 0, 1]
    },
    {
        lineGroup: 2,
        lineMatrixBool: [
            [true, false, false, false, false],
            [false, true, true, true, false],
            [false, false, false, false, true]
        ],
        winPositions: [0, 1, 1, 1, 2]
    },
    {
        lineGroup: 3,
        lineMatrixBool: [
            [false, false, false, false, true],
            [false, true, true, true, false],
            [true, false, false, false, false]
        ],
        winPositions: [2, 1, 1, 1, 0]
    },
    {
        lineGroup: 3,
        lineMatrixBool: [
            [false, true, true, false, false],
            [true, false, false, true, false],
            [false, false, false, false, true]
        ],
        winPositions: [1, 0, 0, 1, 2]
    },
    {
        lineGroup: 2,
        lineMatrixBool: [
            [false, false, false, false, true],
            [true, false, false, true, false],
            [false, true, true, false, false]
        ],
        winPositions: [1, 2, 2, 1, 0]
    },
    {
        lineGroup: 1,
        lineMatrixBool: [
            [false, false, true, false, false],
            [true, true, false, true, false],
            [false, false, false, false, true]
        ],
        winPositions: [1, 1, 0, 1, 2]
    },
    {
        lineGroup: 4,
        lineMatrixBool: [
            [false, false, false, false, true],
            [true, true, false, true, false],
            [false, false, true, false, false]
        ],
        winPositions: [1, 1, 2, 1, 0]
    },
    {
        lineGroup: 4,
        lineMatrixBool: [
            [true, true, false, false, false],
            [false, false, true, false, true],
            [false, false, false, true, false]
        ],
        winPositions: [0, 0, 1, 2, 1]
    },
    {
        lineGroup: 4,
        lineMatrixBool: [
            [false, false, false, true, false],
            [false, false, true, false, true],
            [true, true, false, false, false]
        ],
        winPositions: [2, 2, 1, 0, 1]
    },
    {
        lineGroup: 0,
        lineMatrixBool: [
            [false, true, false, false, false],
            [true, false, true, false, false],
            [false, false, false, true, true]
        ],
        winPositions: [1, 0, 1, 2, 2]
    },
    {
        lineGroup: 2,
        lineMatrixBool: [
            [false, false, false, true, true],
            [true, false, true, false, false],
            [false, true, false, false, false]
        ],
        winPositions: [1, 2, 1, 0, 0]
    },
    {
        lineGroup: 4,
        lineMatrixBool: [
            [true, true, true, false, false],
            [false, false, false, true, false],
            [false, false, false, false, true]
        ],
        winPositions: [0, 0, 0, 1, 2]
    }
]

export const Symbols = {
    //using object instead of enum because I cant make array of enums (eg. Symbols[])
    Wild: 'wild',
    Sherif: 'sherif',
    Diamonds: 'diamonds',
    Hearts: 'hearts',
    Spades: 'spades',
    Clubs: 'clubs',
    A: 'A',
    K: 'K',
    Q: 'Q',
    J: 'J',
    TEN: '10',
    NINE: '9',
    Reward1000: 'reward1000'
}

export const PAYTABLE = [
    {
        symbol: Symbols.Wild,
        payoutPerMatch: [0, 10, 200, 2000, 10000]
    },
    {
        symbol: Symbols.Sherif,
        payoutPerMatch: [0, 2, 25, 100, 750]
    },
    {
        symbol: Symbols.Diamonds,
        payoutPerMatch: [0, 2, 25, 100, 750]
    },
    {
        symbol: Symbols.Hearts,
        payoutPerMatch: [0, 0, 15, 100, 400]
    },
    {
        symbol: Symbols.Spades,
        payoutPerMatch: [0, 0, 10, 75, 250]
    },
    {
        symbol: Symbols.Clubs,
        payoutPerMatch: [0, 0, 10, 50, 250]
    },
    {
        symbol: Symbols.A,
        payoutPerMatch: [0, 0, 10, 50, 125]
    },
    {
        symbol: Symbols.K,
        payoutPerMatch: [0, 0, 5, 50, 100]
    },
    {
        symbol: Symbols.Q,
        payoutPerMatch: [0, 0, 5, 25, 100]
    },
    {
        symbol: Symbols.J,
        payoutPerMatch: [0, 0, 5, 25, 100]
    },
    {
        symbol: Symbols.TEN,
        payoutPerMatch: [0, 0, 5, 25, 100]
    },
    {
        symbol: Symbols.NINE,
        payoutPerMatch: [0, 2, 5, 25, 100]
    },
    {
        symbol: Symbols.Reward1000,
        payoutPerMatch: [],
        specialPayout: [1, 3, 10, 100, 1000]
    }
]

export const LINE_OFFSETS = [0, STRIPE_SIZE / 8, -STRIPE_SIZE / 8, (2 * STRIPE_SIZE) / 8, (-2 * STRIPE_SIZE) / 8]
export const LINE_COLORS = [0xc70000, 0x0300c7, 0xfcec00, 0x14c400, 0xfa00e5]
