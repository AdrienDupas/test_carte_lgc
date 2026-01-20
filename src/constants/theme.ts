// Constantes pour les tailles responsive
export const RESPONSIVE_SIZES = {
  MOBILE_MAX: 500,
  TABLET_MAX: 900,
} as const

// Couleurs de l'application
export const COLORS = {
  PRIMARY: '#DD203C',
  PRIMARY_DARK: '#ba0000',
  PRIMARY_DARKER: '#6d000d',
  SECONDARY: '#4991d9',
  BASE_GRAY: '#e0dcdc',
  BORDER_WHITE: '#ffffff',
  NETWORK_GRAY: '#bfbfbf',
  TEXT_DARK: '#222',
  TEXT_GRAY: '#666',
  TEXT_OCEAN: '#999999',
  BACKGROUND_WHITE: 'rgba(255, 255, 255, 0.7)',
  BACKGROUND_WHITE_SOLID: '#ffffff',
} as const

// Durées d'animation
export const ANIMATION_DURATIONS = {
  FAST: 500,
  MEDIUM: 600,
  SLOW: 700,
  VERY_SLOW: 1800,
} as const

// Z-index
export const Z_INDEX = {
  MAP: 1,
  TOOLTIP: 3000,
  PROMPT: 2000,
  BUTTON: 1000,
  SOURCE: 1000,
} as const
