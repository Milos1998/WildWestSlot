export const APP_WIDTH = 950
export const APP_HEIGHT = 550

export const STRIPE_SIZE = 112

export const STRIPES_PER_REEL = 3
export const REEL_WIDTH = STRIPE_SIZE
export const REEL_HEIGHT = STRIPES_PER_REEL * STRIPE_SIZE
export const DISPLAYS_WIDTH = 150
export const DISPLAYS_HEIGHT = 50

export const REELS_PER_REEL_HOLDER = 5
export const REELS_HOLDER_FRAME_THICKNESS = 3
export const DISPLAYS_FRAME_THICKNESS = 4
export const REELS_HOLDER_WIDTH =
    REEL_WIDTH * REELS_PER_REEL_HOLDER + (REELS_PER_REEL_HOLDER + 1) * REELS_HOLDER_FRAME_THICKNESS
export const REELS_HOLDER_HEIGHT = REEL_HEIGHT + 2 * REELS_HOLDER_FRAME_THICKNESS
export const REELS_HOLDER_X = (APP_WIDTH - REELS_HOLDER_WIDTH) / 2 + 2 * DISPLAYS_FRAME_THICKNESS
export const REELS_HOLDER_Y = 60

export const LEFT_PANNEL_X = (REELS_HOLDER_X - DISPLAYS_WIDTH) / 2
export const LINES_SELECTOR_Y = REELS_HOLDER_Y + (REELS_HOLDER_HEIGHT * 1) / 9
export const BET_SELECTOR_Y = REELS_HOLDER_Y + (REELS_HOLDER_HEIGHT * 4) / 9
export const TOTAL_BET_DISPLAY_Y = REELS_HOLDER_Y + (REELS_HOLDER_HEIGHT * 7) / 9

export const RIGHT_PANNEL_X =
    REELS_HOLDER_X + REELS_HOLDER_WIDTH + (APP_WIDTH - REELS_HOLDER_X - REELS_HOLDER_WIDTH - DISPLAYS_WIDTH) / 2
export const CASH_TRAY_Y = REELS_HOLDER_Y + (REELS_HOLDER_HEIGHT * 1) / 3 - DISPLAYS_HEIGHT / 2
export const BALANCE_Y = REELS_HOLDER_Y + (REELS_HOLDER_HEIGHT * 2) / 3 - DISPLAYS_HEIGHT / 2

export const BUTTONS_SIZE = 100
export const CENTRAL_PANNEL_Y =
    REELS_HOLDER_Y + REELS_HOLDER_HEIGHT + (APP_HEIGHT - REELS_HOLDER_Y - REELS_HOLDER_HEIGHT - BUTTONS_SIZE) / 2
export const SPIN_BUTTON_X = (APP_WIDTH * 1) / 3 - BUTTONS_SIZE / 2
export const AUTO_SPIN_BUTTON_X = (APP_WIDTH * 2) / 3 - BUTTONS_SIZE / 2

//colors and lines
export const APP_BACKGROUND_COLOR = 0xb45f06
//export const REELS_HOLDER_FRAME_THICKNESS= 3
export const DISPLAYS_COLOR = 0x723c18
export const DISPLAYS_FRAME_COLOR = 0x390e09
//export const DISPLAYS_FRAME_THICKNESS= 4
export const DISPLAYS_DISABLED_BUTTON_COLOR = 0x666666
export const DISPLAYS_FONT_FILL = 0xffffff
export const DISPLAYS_FONT_FAMILY = '"Courier New", Courier, monospace'
export const BUTTONS_FRAME_THICKNESS = 4
export const BUTTONS_FRAME_COLOR = 0xf7ae01
export const SPIN_BUTTON_ACTIVE_COLOR = 0xda0b20
export const SPIN_BUTTON_INACTIVE_TINT = 0x888888
export const AUTO_SPIN_BUTTON_ON_COLOR = 0x007400
export const AUTO_SPIN_BUTTON_OFF_COLOR = 0x302986
export const AUTO_SPIN_BUTTON_OFF_INACTIVE_TINT = 0x888888
export const BUTTON_DECORATION_ACTIVE_COLOR = BUTTONS_FRAME_COLOR
export const BUTTON_DECORATION_INACTIVE_COLOR = 0x845d01
export const WIN_LINE_THICKNESS = 6
export const STRIPE_FRAME_TO_SYMBOL_RATIO = 0.84
export const SPECIAL_SYMBOL_FRAME_COLOR = 0xf5d66a

//Data starting state
export const BETS = [0.01, 0.02, 0.03, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 3, 4, 5]
export const STARTING_BALANCE = 500

//animation
export const REEL_SPIN_DELAY = 0.15
export const REEL_SPIN_START_ROTATION = 1
export const REEL_SPIN_MID_ROTATION = 3
export const REEL_SPIN_END_ROTATION = 1

//enums
export enum SpinBtnState {
    Neutral,
    Skip,
    Skipping,
    Collect
}

export enum AutoSpinBtnState {
    OffDisabled,
    OffEnabled,
    On
}
