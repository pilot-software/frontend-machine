/**
 * Enterprise Design System
 * Centralized design tokens for consistent UI across all routes
 */

export const DESIGN_TOKENS = {
  // Spacing Scale (8px base)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Typography Scale
  typography: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },

  // Border Radius
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

// Animation Presets
export const ANIMATIONS = {
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideInFromTop: 'animate-in slide-in-from-top-2 duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom-2 duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left-2 duration-300',
  slideInFromRight: 'animate-in slide-in-from-right-2 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
} as const;

// Component Variants
export const COMPONENT_VARIANTS = {
  card: {
    default: 'bg-card border border-card-border rounded-lg shadow-sm',
    elevated: 'bg-card border border-card-border rounded-lg shadow-md hover:shadow-lg transition-shadow',
    flat: 'bg-card rounded-lg',
    outlined: 'bg-transparent border-2 border-border rounded-lg',
  },
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-input bg-transparent hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
  input: {
    default: 'bg-input-background border border-input rounded-md focus:ring-2 focus:ring-ring',
    filled: 'bg-muted border-0 rounded-md focus:ring-2 focus:ring-ring',
    outlined: 'bg-transparent border-2 border-input rounded-md focus:border-primary',
  },
} as const;

// Layout Patterns
export const LAYOUT_PATTERNS = {
  container: 'container-responsive',
  section: 'py-6 md:py-8 lg:py-12',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  stack: 'flex flex-col gap-4 md:gap-6',
  cluster: 'flex flex-wrap gap-2 md:gap-3',
} as const;

// Status Colors
export const STATUS_COLORS = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
  },
} as const;
