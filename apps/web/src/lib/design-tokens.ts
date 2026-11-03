/**
 * VitaSync Design System Tokens (Light-Mode First & Only)
 */
export const tokens = {
  colors: {
    canvas: 'hsl(var(--background))',
    card: 'hsl(var(--card))',
    surfaceSubtle: 'hsl(var(--surface-subtle))',
    border: 'hsl(var(--border))',
    textPrimary: 'hsl(var(--foreground))',
    textMuted: 'hsl(var(--muted-foreground))',
    brandPrimary: 'hsl(var(--primary))',
    brandSecondary: 'hsl(var(--secondary))',
    destructive: 'hsl(var(--destructive))',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    heading1: 'text-2xl font-semibold tracking-tight text-foreground',
    heading2: 'text-xl font-semibold tracking-tight text-foreground',
    heading3: 'text-lg font-medium text-foreground',
    body: 'text-sm text-foreground',
    bodyMuted: 'text-sm text-muted-foreground',
    caption: 'text-xs text-muted-foreground',
    label: 'text-xs font-medium text-foreground',
  },
  spacing: {
    mobileHeaderHeight: '3.5rem',
    mobileBottomNavHeight: '4rem',
    sidebarWidth: '16rem',
    pagePaddingXMobile: 'px-4',
    pagePaddingXDesktop: 'sm:px-6 lg:px-8',
    pagePaddingY: 'py-6',
  },
  radii: {
    sm: 'rounded-sm', // 4px
    md: 'rounded-md', // 6px
    lg: 'rounded-lg', // 8px
    full: 'rounded-full',
  },
  shadows: {
    subtle: 'shadow-sm',
    none: 'shadow-none',
  },
} as const;
