import { foundation } from './foundation';

export const semantic = {
  color: {
    page:            foundation.color.neutral[100],
    surface:         foundation.color.neutral[0],
    surfaceRaised:   foundation.color.neutral[50],
    surfaceDisabled: foundation.color.neutral[200],

    textPrimary:   foundation.color.neutral[800],
    textSecondary: foundation.color.neutral[700],
    textMuted:     foundation.color.neutral[600],
    textTertiary:  foundation.color.neutral[500],
    textDisabled:  foundation.color.neutral[400],
    textInverse:   foundation.color.neutral[0],

    borderDefault: foundation.color.neutral[300],
    borderSubtle:  foundation.color.neutral[200],
    borderStrong:  foundation.color.neutral[400],

    actionPrimary: foundation.color.brand.base,
    actionHover:   foundation.color.brand.hover,
    actionPressed: foundation.color.brand.pressed,
    actionSubtle:  foundation.color.brand.subtle,

    success:       foundation.color.green.bg,
    successSubtle: foundation.color.green.subtle,
    successText:   foundation.color.green.text,
    successPaleBg: foundation.color.green.paleBg,
    successPaleText:foundation.color.green.paleText,

    warning:       foundation.color.amber.bg,
    warningSubtle: foundation.color.amber.subtle,
    warningText:   foundation.color.amber.text,
    warningPaleBg: foundation.color.amber.paleBg,
    warningPaleText:foundation.color.amber.paleText,

    error:         foundation.color.red.bg,
    errorSubtle:   foundation.color.red.subtle,
    errorText:     foundation.color.red.text,
    errorPaleBg:   foundation.color.red.paleBg,

    info:          foundation.color.blue.bg,
    infoSubtle:    foundation.color.blue.subtle,
    infoText:      foundation.color.blue.text,

    focusRing: foundation.color.brand.subtle,
    overlay:   foundation.color.overlay,

    // Status badge fills
    statusReviewBg:   foundation.color.teal.bg,
    statusReviewText: foundation.color.teal.text,
    statusPackingBg:  foundation.color.yellow.bg,
    statusPackingText:foundation.color.yellow.text,

    // Rx tag
    rxBg:   foundation.color.brand.rx,
    rxText: foundation.color.brand.rxText,

    // Warning action (orange CTA)
    warningAction:       foundation.color.orange.bg,
    warningActionHover:  foundation.color.orange.hover,
    warningActionSubtle: foundation.color.orange.subtle,

    // UI chrome
    rowDefault:     foundation.color.chrome.rowBg,
    scrollbarThumb: foundation.color.chrome.scrollbarThumb,
    brandIconBg:    foundation.color.brand.iconBg,
  },

  shadow: {
    surface:  foundation.shadow.surface,
    floating: foundation.shadow.floating,
    layer:    foundation.shadow.layer,
    scroll:   foundation.shadow.scroll,
  },

  motion: {
    alpha:    foundation.motion.alpha,
    fast:     foundation.motion.fast,
    subtle:   foundation.motion.subtle,
    collapse: foundation.motion.collapse,
    normal:   foundation.motion.normal,
    leave:    foundation.motion.leave,
    enter:    foundation.motion.enter,
    scan:     foundation.motion.scan,
    reveal:   foundation.motion.reveal,
    progress: foundation.motion.progress,
    easing:   foundation.motion.easing,
    easeInOut:foundation.motion.easeInOut,
    easeIn:   foundation.motion.easeIn,
    linear:   foundation.motion.linear,
    spring:   foundation.motion.spring,
  },

  spacing: {
    0:  foundation.spacing[0],
    1:  foundation.spacing[1],
    2:  foundation.spacing[2],
    3:  foundation.spacing[3],
    4:  foundation.spacing[4],
    5:  foundation.spacing[5],
    6:  foundation.spacing[6],
    8:  foundation.spacing[8],
    10: foundation.spacing[10],
  },

  font: {
    family: {
      sans:    foundation.font.family.sans,
      numeric: foundation.font.family.numeric,
    },
    size:     foundation.font.size,
    weight:   foundation.font.weight,
    leading:  foundation.font.leading,
    tracking: foundation.font.tracking,
  },

  radius: {
    none: foundation.radius.none,
  },

  opacity: {
    70: foundation.alpha.opacity70,
  },

  sizing: {
    control: {
      lg: foundation.sizing.control.lg,
      md: foundation.sizing.control.md,
      sm: foundation.sizing.control.sm,
      xs: foundation.sizing.control.xs,
    },
    square: {
      filter:  foundation.sizing.square.filter,
      control: foundation.sizing.square.control,
      item:    foundation.sizing.square.item,
      barcode: foundation.sizing.square.barcode,
      status:  foundation.sizing.square.status,
    },
    badge: {
      height:   foundation.sizing.badge.height,
      paddingX: foundation.sizing.badge.paddingX,
      gap:      foundation.sizing.badge.gap,
    },
    pill: {
      interactive: foundation.sizing.pill.interactive,
    },
    input: {
      paddingX: foundation.sizing.input.paddingX,
    },
    card: {
      padding: { compact: foundation.sizing.card.padding.compact, comfortable: foundation.sizing.card.padding.comfortable, spacious: foundation.sizing.card.padding.spacious },
      gap:     { compact: foundation.sizing.card.gap.compact,     comfortable: foundation.sizing.card.gap.comfortable,     spacious: foundation.sizing.card.gap.spacious     },
    },
    icon: {
      xs:     foundation.sizing.icon.xs,
      sm:     foundation.sizing.icon.sm,
      inline: foundation.sizing.icon.inline,
      md:     foundation.sizing.icon.md,
      lg:     foundation.sizing.icon.lg,
    },
  },

  // Type role documentation — use when adding new components to ensure consistent
  // typographic decisions. Individual font vars are now available as --s-size-*,
  // --s-weight-*, --s-font-*, --s-leading-*, --s-tracking-* semantic CSS vars.
  type: {
    display: {
      size:     foundation.font.size['3xl'],
      weight:   foundation.font.weight.strong,
      leading:  foundation.font.leading.none,
      tracking: foundation.font.tracking.normal,
    },
    buyerName: {
      size:     foundation.font.size['3xl'],
      weight:   foundation.font.weight.semibold,
      leading:  foundation.font.leading.none,
      tracking: foundation.font.tracking.normal,
    },
    heading: {
      size:    foundation.font.size['2xl'],
      weight:  foundation.font.weight.bold,
      leading: foundation.font.leading.normal,
    },
    titleLg: {
      size:   foundation.font.size['2xl'],
      weight: foundation.font.weight.bold,
    },
    title: {
      size:     foundation.font.size.xl,
      weight:   foundation.font.weight.strong,
      leading:  foundation.font.leading.normal,
      tracking: foundation.font.tracking.normal,
    },
    body: {
      size:    foundation.font.size.md,
      weight:  foundation.font.weight.regular,
      leading: foundation.font.leading.body,
    },
    label: {
      size:     foundation.font.size.md,
      weight:   foundation.font.weight.semibold,
      tracking: foundation.font.tracking.normal,
    },
    labelSm: {
      size:     foundation.font.size.md,
      weight:   foundation.font.weight.semibold,
      tracking: foundation.font.tracking.normal,
    },
    meta: {
      size:    foundation.font.size.md,
      leading: foundation.font.leading.normal,
    },
    micro: {
      size:   foundation.font.size.sm,
      weight: foundation.font.weight.medium,
    },
    mono: {
      size:     foundation.font.size.md,
      tracking: foundation.font.tracking.normal,
      family:   foundation.font.family.numeric,
    },
    monoLg: {
      size:     foundation.font.size['2xl'],
      weight:   foundation.font.weight.bold,
      tracking: foundation.font.tracking.normal,
      family:   foundation.font.family.numeric,
    },
  },
} as const;

// CSS custom-property map — written to src/app/tokens/semantic.css; values reference --f-* vars only
export const semanticCssVars = {
  '--s-page':             'var(--f-n-100)',
  '--s-surface':          'var(--f-n-0)',
  '--s-surface-raised':   'var(--f-n-50)',
  '--s-surface-disabled': 'var(--f-n-200)',

  '--s-text-primary':   'var(--f-n-800)',
  '--s-text-secondary': 'var(--f-n-700)',
  '--s-text-muted':     'var(--f-n-600)',
  '--s-text-tertiary':  'var(--f-n-500)',
  '--s-text-disabled':  'var(--f-n-400)',
  '--s-text-inverse':   'var(--f-n-0)',

  '--s-border-default': 'var(--f-n-300)',
  '--s-border-subtle':  'var(--f-n-200)',
  '--s-border-strong':  'var(--f-n-400)',

  '--s-action-primary': 'var(--f-brand-base)',
  '--s-action-hover':   'var(--f-brand-hover)',
  '--s-action-pressed': 'var(--f-brand-pressed)',
  '--s-action-subtle':  'var(--f-brand-subtle)',

  '--s-success':        'var(--f-green-bg)',
  '--s-success-subtle': 'var(--f-green-subtle)',
  '--s-success-text':   'var(--f-green-text)',

  '--s-warning':        'var(--f-amber-bg)',
  '--s-warning-subtle': 'var(--f-amber-subtle)',
  '--s-warning-text':   'var(--f-amber-text)',

  '--s-error':        'var(--f-red-bg)',
  '--s-error-subtle': 'var(--f-red-subtle)',
  '--s-error-text':   'var(--f-red-text)',

  '--s-info':        'var(--f-blue-bg)',
  '--s-info-subtle': 'var(--f-blue-subtle)',
  '--s-info-text':   'var(--f-blue-text)',

  '--s-focus-ring': 'var(--f-brand-subtle)',
  '--s-overlay':    'var(--f-overlay)',

  '--s-shadow-surface':  'var(--f-shadow-surface)',
  '--s-shadow-floating': 'var(--f-shadow-floating)',
  '--s-shadow-layer':    'var(--f-shadow-layer)',

  // UI chrome (consumed by component layer)
  '--s-row-default':     'var(--f-n-row-bg)',
  '--s-scrollbar-thumb': 'var(--f-n-scrollbar-thumb)',
  '--s-brand-icon-bg':   'var(--f-brand-icon-bg)',

  // Display text (logo / hero — intentionally darker than text-primary)
  '--s-text-display': 'var(--f-n-900)',

  // Success extended
  '--s-success-pale-bg':   'var(--f-green-pale-bg)',
  '--s-success-pale-text': 'var(--f-green-pale-text)',

  // Warning extended
  '--s-warning-pale-bg':   'var(--f-amber-pale-bg)',
  '--s-warning-pale-text': 'var(--f-amber-pale-text)',

  // Error extended
  '--s-error-pale-bg':   'var(--f-red-pale-bg)',
  '--s-error-pressed':   'var(--f-red-pressed)',
  '--s-error-disabled':  'var(--f-red-disabled)',

  // Status badge fills
  '--s-status-review-bg':    'var(--f-teal-bg)',
  '--s-status-review-text':  'var(--f-teal-text)',
  '--s-status-packing-bg':   'var(--f-yellow-bg)',
  '--s-status-packing-text': 'var(--f-yellow-text)',

  // Rx badge
  '--s-rx-badge-bg':   'var(--f-brand-rx)',
  '--s-rx-badge-text': 'var(--f-brand-rx-text)',

  // Warning action (orange CTA)
  '--s-warning-action':        'var(--f-orange-bg)',
  '--s-warning-action-hover':  'var(--f-orange-hover)',
  '--s-warning-action-text':   'var(--f-orange-text)',
  '--s-warning-action-subtle': 'var(--f-orange-subtle)',

  // Alpha overlays (barcode scan rows, incoming popup header)
  '--s-alpha-white-78': 'var(--f-white-78)',
  '--s-alpha-white-84': 'var(--f-white-84)',
  '--s-alpha-white-36': 'var(--f-white-36)',
  '--s-alpha-white-16': 'var(--f-white-16)',

  // Prescription viewer
  '--s-prescription-grid': 'var(--f-rx-grid-line)',
  '--s-prescription-bg':   'var(--f-rx-bg)',
  '--s-prescription-line': 'var(--f-rx-doc-line)',

  // Scroll shadow (radial gradient overlay for scrollable regions)
  '--s-scroll-shadow': 'var(--f-scroll-shadow)',

  // Decorative hatching in .list-filters gutter strips
  '--s-hatch-bg':     'var(--f-n-hatch-bg)',
  '--s-hatch-stripe': 'var(--f-n-hatch-stripe)',

  // Motion timing — durations
  '--s-motion-alpha':    'var(--f-motion-alpha)',
  '--s-motion-fast':     'var(--f-motion-fast)',
  '--s-motion-subtle':   'var(--f-motion-subtle)',
  '--s-motion-collapse': 'var(--f-motion-collapse)',
  '--s-motion-normal':   'var(--f-motion-normal)',
  '--s-motion-leave':    'var(--f-motion-leave)',
  '--s-motion-enter':    'var(--f-motion-enter)',
  '--s-motion-scan':     'var(--f-motion-scan)',
  '--s-motion-reveal':   'var(--f-motion-reveal)',
  '--s-motion-progress': 'var(--f-motion-progress)',
  // Motion timing — easing curves
  '--s-motion-ease-out':   'var(--f-motion-ease-out)',
  '--s-motion-ease-inout': 'var(--f-motion-ease-inout)',
  '--s-motion-ease-in':    'var(--f-motion-ease-in)',
  '--s-motion-linear':     'var(--f-motion-linear)',
  '--s-motion-spring':     'var(--f-motion-spring)',

  // Spacing scale (base unit 4px)
  '--s-space-0':  'var(--f-space-0)',
  '--s-space-1':  'var(--f-space-1)',
  '--s-space-2':  'var(--f-space-2)',
  '--s-space-3':  'var(--f-space-3)',
  '--s-space-4':  'var(--f-space-4)',
  '--s-space-5':  'var(--f-space-5)',
  '--s-space-6':  'var(--f-space-6)',
  '--s-space-8':  'var(--f-space-8)',
  '--s-space-10': 'var(--f-space-10)',

  // Sizing — controls (Button / Input / Select)
  '--s-sizing-control-lg': 'var(--f-sizing-control-lg)',
  '--s-sizing-control-md': 'var(--f-sizing-control-md)',
  '--s-sizing-control-sm': 'var(--f-sizing-control-sm)',
  '--s-sizing-control-xs': 'var(--f-sizing-control-xs)',

  // Sizing — squares (Icon button / Avatar)
  '--s-sizing-square-filter':  'var(--f-sizing-square-filter)',
  '--s-sizing-square-control': 'var(--f-sizing-square-control)',
  '--s-sizing-square-item':    'var(--f-sizing-square-item)',
  '--s-sizing-square-barcode': 'var(--f-sizing-square-barcode)',
  '--s-sizing-square-status':  'var(--f-sizing-square-status)',

  // Sizing — badge (static metadata, single size)
  '--s-sizing-badge-height':    'var(--f-sizing-badge-height)',
  '--s-sizing-badge-padding-x': 'var(--f-sizing-badge-padding-x)',
  '--s-sizing-badge-gap':       'var(--f-sizing-badge-gap)',

  // Sizing — pill (interactive)
  '--s-sizing-pill-interactive': 'var(--f-sizing-pill-interactive)',

  // Sizing — input (height via control; single padding-x)
  '--s-sizing-input-padding-x': 'var(--f-sizing-input-padding-x)',

  // Sizing — card (density-based; no fixed heights)
  '--s-sizing-card-padding-compact':     'var(--f-sizing-card-padding-compact)',
  '--s-sizing-card-padding-comfortable': 'var(--f-sizing-card-padding-comfortable)',
  '--s-sizing-card-padding-spacious':    'var(--f-sizing-card-padding-spacious)',
  '--s-sizing-card-gap-compact':         'var(--f-sizing-card-gap-compact)',
  '--s-sizing-card-gap-comfortable':     'var(--f-sizing-card-gap-comfortable)',
  '--s-sizing-card-gap-spacious':        'var(--f-sizing-card-gap-spacious)',

  // Sizing — icon glyphs
  '--s-sizing-icon-xs':     'var(--f-sizing-icon-xs)',
  '--s-sizing-icon-sm':     'var(--f-sizing-icon-sm)',
  '--s-sizing-icon-inline': 'var(--f-sizing-icon-inline)',
  '--s-sizing-icon-md':     'var(--f-sizing-icon-md)',
  '--s-sizing-icon-lg':     'var(--f-sizing-icon-lg)',

  // Typography — family
  '--s-font-sans':    'var(--f-font-sans)',
  '--s-font-numeric': 'var(--f-font-numeric)',

  // Typography — size
  '--s-size-sm':  'var(--f-size-sm)',
  '--s-size-md':  'var(--f-size-md)',
  '--s-size-xl':  'var(--f-size-xl)',
  '--s-size-2xl': 'var(--f-size-2xl)',
  '--s-size-3xl': 'var(--f-size-3xl)',

  // Typography — weight
  '--s-weight-thin':      'var(--f-weight-thin)',
  '--s-weight-regular':   'var(--f-weight-regular)',
  '--s-weight-medium':    'var(--f-weight-medium)',
  '--s-weight-semibold':  'var(--f-weight-semibold)',
  '--s-weight-strong':    'var(--f-weight-strong)',
  '--s-weight-upper':     'var(--f-weight-upper)',
  '--s-weight-bold':      'var(--f-weight-bold)',
  '--s-weight-extrabold': 'var(--f-weight-extrabold)',

  // Typography — leading (line-height) and tracking (letter-spacing)
  '--s-leading-none':    'var(--f-leading-none)',
  '--s-leading-normal':  'var(--f-leading-normal)',
  '--s-leading-body':    'var(--f-leading-body)',
  '--s-tracking-normal': 'var(--f-tracking-normal)',

  // Radius
  '--s-radius-none': 'var(--f-r-none)',

  // Opacity
  '--s-opacity-70': 'var(--f-opacity-70)',
} as const;
