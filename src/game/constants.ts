export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 500 // 8:5, matches the original 1989 arcade Pang's 384x240 ratio

export const PLAYER_WIDTH = 32
export const PLAYER_HEIGHT = 48
export const PLAYER_Y = CANVAS_HEIGHT - PLAYER_HEIGHT
export const PLAYER_SPEED = 240 // px/s

export const WIRE_SPEED = 400 // px/s

export const BALLOON_RADIUS = { large: 32, small: 18 }
export const FLOOR_Y = CANVAS_HEIGHT
export const GRAVITY = 260 // px/s^2 (lowered for a lower, slower bounce)
export const BALLOON_SPEED_X = 60 // px/s (slowest in the series, tutorial pace)

export const SCORE_TABLE = { large: 100, small: 300 } as const
