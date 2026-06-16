export const foundation = {
  color: {
    brand: {
      base:    '#3675ff',
      hover:   '#4e86ff',
      pressed: '#2959c2',
      subtle:  '#c7d8ff',
      rx:      '#DCE9FF',
      rxText:  '#2E63E6',
      iconBg:  '#2563EB',
    },
    neutral: {
      900: '#111111',
      800: '#1E222B',
      700: '#4D5360',
      600: '#666C78',
      // Darkened from #868C98 (was 3.37:1 on white, fails WCAG AA) → 4.72:1
      500: '#6E7580',
      400: '#A8ACB7',
      300: '#DDDEE2',
      200: '#EFEFF1',
      100: '#F7F7F8',
      50:  '#FCFCFC',
      0:   '#FFFFFF',
    },
    // UI-chrome: named alpha/tint values derived from the neutral scale.
    // Kept separate so neutral stays a pure numeric scale.
    chrome: {
      rowBg:         '#F6F7F9',
      scrollbarThumb:'rgba(134, 140, 152, 0.12)',
      hatchBg:       'rgba(134, 140, 152, 0.08)',
      hatchStripe:   'rgba(77, 83, 96, 0.08)',
    },
    overlay: 'rgba(18,21,27,0.64)',
    green: {
      bg:       '#1F9D55',
      subtle:   '#EAF8EE',
      text:     '#137A3F',
      paleBg:   '#ECF9F2',
      paleText: '#157347',
    },
    amber: {
      bg:       '#F59E0B',
      subtle:   '#FFF4E5',
      text:     '#B96F00',
      paleBg:   '#FFF7E8',
      paleText: '#9A6700',
    },
    blue: {
      bg:     '#2F80ED',
      subtle: '#EAF4FF',
      text:   '#1D5FBF',
    },
    red: {
      bg:       '#E6412E',
      subtle:   '#FEE2DF',
      // Darkened from #E6412E (was identical to bg, 3.8:1 on white, fails WCAG AA) → 6.9:1
      text:     '#B42318',
      pressed:  '#D4472F',
      disabled: 'rgba(234, 83, 58, 0.3)',
      paleBg:   '#FDEDEC',
    },
    orange: {
      bg:     '#FC7405',
      subtle: '#FFF3E6',
      // Darkened from #FC7405 (was identical to bg, 2.6:1 on white, fails WCAG AA) → 4.88:1
      text:   '#B85400',
      hover:  '#FD8C30',
    },
    teal: {
      bg:   '#64FCBA',
      text: '#0F3B2D',
    },
    yellow: {
      bg:   '#FCE364',
      text: '#3A2E00',
    },
  },
  font: {
    family: {
      sans:    "'Plus Jakarta Sans', sans-serif",
      numeric: "'DM Sans', sans-serif",
    },
    size: {
      sm:    '12px',
      md:    '14px',
      xl:    '16px',
      '2xl': '18px',
      '3xl': '28px',
    },
    weight: {
      thin:      '100',
      regular:   '400',
      medium:    '500',
      semibold:  '600',
      // 620 / 650 use CSS Fonts Level 4 numeric weight (valid 1–1000 for variable fonts).
      // Plus Jakarta Sans is served as a variable font by Google Fonts — these will interpolate.
      strong:    '620',
      upper:     '650',
      bold:      '700',
      extrabold: '800',
    },
    leading: {
      none:    '1.0',
      normal:  '1.2',
      body:    '1.5',
    },
    tracking: {
      normal: '0rem',
    },
  },
  radius: {
    none: '0px',
  },
  spacing: {
    0:  '0px',
    1:  '4px',
    2:  '8px',
    3:  '12px',
    4:  '16px',
    5:  '20px',
    6:  '24px',
    8:  '32px',
    10: '40px',
  },
  sizing: {
    // Button / Input / Select — fixed-height interactive controls
    control: {
      lg: '54px',   // primary CTA, main inputs, primary tabs
      md: '42px',   // compact actions, sub buttons
      sm: '34px',   // small inputs, secondary controls
      xs: '32px',   // extra-small controls
    },
    // Icon button / Avatar — square affordances
    square: {
      filter:  '54px',  // filter-bar square cells (matches control.lg)
      control: '42px',  // icon buttons, avatar cells (matches control.md)
      item:    '30px',  // list item icon cells
      barcode: '24px',  // barcode popup icon cells
      status:  '20px',  // status icon glyph area
    },
    // Badge — static metadata, non-interactive. Single unified size at 24px.
    badge: {
      height:   '24px',
      paddingX: '8px',
      gap:      '4px',
    },
    // Interactive pill — more hit area than a static badge
    pill: {
      interactive: '36px',
    },
    // Input — height aligns with control; single padding-x
    input: {
      paddingX: '12px',
    },
    // Card — density variants; no fixed heights (padding + gap only)
    card: {
      padding: { compact: '16px', comfortable: '24px', spacious: '32px' },
      gap:     { compact: '12px', comfortable: '16px', spacious: '24px' },
    },
    // Icon glyph sizes (font-size on SVG icons at 1em)
    icon: {
      xs:     '12px',
      sm:     '14px',
      inline: '13px',
      md:     '16px',
      lg:     '18px',
    },
  },
  shadow: {
    surface:  '0 2px 6px rgba(18,21,27,0.10)',
    floating: '0 6px 16px rgba(18,21,27,0.12)',
    layer:    '0 12px 32px rgba(18,21,27,0.16)',
    scroll:   'rgba(0, 0, 0, 0.08)',
  },
  motion: {
    // Durations
    alpha:    '180ms',   // opacity-only transitions within a collapse sequence
    fast:     '100ms',   // hover, active, toggle, micro-state
    subtle:   '200ms',   // scroll shadow fade, subtle opacity cues
    collapse: '260ms',   // panel height collapse / expand
    normal:   '280ms',   // search expand, panel transitions
    leave:    '400ms',   // dismiss / leave animations
    enter:    '420ms',   // element entry (row slide-in)
    scan:     '520ms',   // barcode scan state transitions
    reveal:   '600ms',   // modal, toast enter and exit
    progress: '900ms',   // progress bar fill — intentionally slow
    // Easing curves
    easing:    'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    // easeIn: used for collapsing/closing animations (element leaves toward its natural resting state)
    easeIn:    'cubic-bezier(0.42, 0, 1, 1)',
    // linear: used exclusively for progress bar fill — constant rate is correct for progress
    linear:    'linear',
    // spring: snappy entry spring for list-row and similar enter animations
    spring:    'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  zIndex: {
    dropdown: 40,
    popup:    700,
    modal:    708,
    barcode:  710,
  },
  alpha: {
    white78:   'rgba(255, 255, 255, 0.78)',
    white84:   'rgba(255, 255, 255, 0.84)',
    white36:   'rgba(255, 255, 255, 0.36)',
    white16:   'rgba(255, 255, 255, 0.16)',
    // Opacity value (unitless) — use with the CSS opacity property, not as a color
    opacity70: 0.7,
  },
  prescription: {
    gridLine: 'rgba(46, 99, 230, 0.08)',
    bg:       '#FAFBFF',
    docLine:  'rgba(30, 41, 59, 0.14)',
  },
} as const;

// CSS custom-property map — written to src/app/tokens/foundation.css by render-token-css.cjs
export const foundationCssVars = {
  // Brand
  '--f-brand-base':    foundation.color.brand.base,
  '--f-brand-hover':   foundation.color.brand.hover,
  '--f-brand-pressed': foundation.color.brand.pressed,
  '--f-brand-subtle':  foundation.color.brand.subtle,
  '--f-brand-rx':      foundation.color.brand.rx,
  '--f-brand-rx-text': foundation.color.brand.rxText,
  '--f-brand-icon-bg': foundation.color.brand.iconBg,

  // Neutral scale
  '--f-n-900':             foundation.color.neutral[900],
  '--f-n-800':             foundation.color.neutral[800],
  '--f-n-700':             foundation.color.neutral[700],
  '--f-n-600':             foundation.color.neutral[600],
  '--f-n-500':             foundation.color.neutral[500],
  '--f-n-400':             foundation.color.neutral[400],
  '--f-n-300':             foundation.color.neutral[300],
  '--f-n-200':             foundation.color.neutral[200],
  '--f-n-100':             foundation.color.neutral[100],
  '--f-n-50':              foundation.color.neutral[50],
  '--f-n-0':               foundation.color.neutral[0],
  '--f-n-row-bg':          foundation.color.chrome.rowBg,
  '--f-n-scrollbar-thumb': foundation.color.chrome.scrollbarThumb,
  '--f-n-hatch-bg':        foundation.color.chrome.hatchBg,
  '--f-n-hatch-stripe':    foundation.color.chrome.hatchStripe,

  // Status palette
  '--f-green-bg':        foundation.color.green.bg,
  '--f-green-subtle':    foundation.color.green.subtle,
  '--f-green-text':      foundation.color.green.text,
  '--f-green-pale-bg':   foundation.color.green.paleBg,
  '--f-green-pale-text': foundation.color.green.paleText,
  '--f-amber-bg':        foundation.color.amber.bg,
  '--f-amber-subtle':    foundation.color.amber.subtle,
  '--f-amber-text':      foundation.color.amber.text,
  '--f-amber-pale-bg':   foundation.color.amber.paleBg,
  '--f-amber-pale-text': foundation.color.amber.paleText,
  '--f-blue-bg':         foundation.color.blue.bg,
  '--f-blue-subtle':     foundation.color.blue.subtle,
  '--f-blue-text':       foundation.color.blue.text,
  '--f-red-bg':          foundation.color.red.bg,
  '--f-red-subtle':      foundation.color.red.subtle,
  '--f-red-text':        foundation.color.red.text,
  '--f-red-pale-bg':     foundation.color.red.paleBg,
  '--f-red-pressed':     foundation.color.red.pressed,
  '--f-red-disabled':    foundation.color.red.disabled,
  '--f-orange-bg':       foundation.color.orange.bg,
  '--f-orange-text':     foundation.color.orange.text,
  '--f-orange-subtle':   foundation.color.orange.subtle,
  '--f-orange-hover':    foundation.color.orange.hover,
  '--f-teal-bg':         foundation.color.teal.bg,
  '--f-teal-text':       foundation.color.teal.text,
  '--f-yellow-bg':       foundation.color.yellow.bg,
  '--f-yellow-text':     foundation.color.yellow.text,
  '--f-overlay':         foundation.color.overlay,

  // Alpha / prescription
  '--f-white-78':     foundation.alpha.white78,
  '--f-white-84':     foundation.alpha.white84,
  '--f-white-36':     foundation.alpha.white36,
  '--f-white-16':     foundation.alpha.white16,
  '--f-rx-grid-line': foundation.prescription.gridLine,
  '--f-rx-bg':        foundation.prescription.bg,
  '--f-rx-doc-line':  foundation.prescription.docLine,

  // Shadows
  '--f-shadow-surface':  foundation.shadow.surface,
  '--f-shadow-floating': foundation.shadow.floating,
  '--f-shadow-layer':    foundation.shadow.layer,
  '--f-scroll-shadow':   foundation.shadow.scroll,

  // Typography — family
  '--f-font-sans':    foundation.font.family.sans,
  '--f-font-numeric': foundation.font.family.numeric,

  // Typography — size
  '--f-size-sm':  foundation.font.size.sm,
  '--f-size-md':  foundation.font.size.md,
  '--f-size-xl':  foundation.font.size.xl,
  '--f-size-2xl': foundation.font.size['2xl'],
  '--f-size-3xl': foundation.font.size['3xl'],

  // Typography — weight
  '--f-weight-thin':      foundation.font.weight.thin,
  '--f-weight-regular':   foundation.font.weight.regular,
  '--f-weight-medium':    foundation.font.weight.medium,
  '--f-weight-semibold':  foundation.font.weight.semibold,
  '--f-weight-strong':    foundation.font.weight.strong,
  '--f-weight-upper':     foundation.font.weight.upper,
  '--f-weight-bold':      foundation.font.weight.bold,
  '--f-weight-extrabold': foundation.font.weight.extrabold,

  // Typography — leading (line-height)
  '--f-leading-none':    foundation.font.leading.none,
  '--f-leading-normal':  foundation.font.leading.normal,
  '--f-leading-body':    foundation.font.leading.body,

  // Typography — tracking (letter-spacing)
  '--f-tracking-normal': foundation.font.tracking.normal,

  // Radius
  '--f-r-none':    foundation.radius.none,

  // Motion
  '--f-motion-alpha':    foundation.motion.alpha,
  '--f-motion-fast':     foundation.motion.fast,
  '--f-motion-subtle':   foundation.motion.subtle,
  '--f-motion-collapse': foundation.motion.collapse,
  '--f-motion-normal':   foundation.motion.normal,
  '--f-motion-leave':    foundation.motion.leave,
  '--f-motion-enter':    foundation.motion.enter,
  '--f-motion-scan':     foundation.motion.scan,
  '--f-motion-reveal':   foundation.motion.reveal,
  '--f-motion-progress': foundation.motion.progress,
  '--f-motion-ease-out':   foundation.motion.easing,
  '--f-motion-ease-inout': foundation.motion.easeInOut,
  '--f-motion-ease-in':    foundation.motion.easeIn,
  '--f-motion-linear':     foundation.motion.linear,
  '--f-motion-spring':     foundation.motion.spring,

  '--f-opacity-70':   foundation.alpha.opacity70,

  // Spacing scale (base unit 4px)
  '--f-space-0':  foundation.spacing[0],
  '--f-space-1':  foundation.spacing[1],
  '--f-space-2':  foundation.spacing[2],
  '--f-space-3':  foundation.spacing[3],
  '--f-space-4':  foundation.spacing[4],
  '--f-space-5':  foundation.spacing[5],
  '--f-space-6':  foundation.spacing[6],
  '--f-space-8':  foundation.spacing[8],
  '--f-space-10': foundation.spacing[10],

  // Sizing — controls (Button / Input / Select)
  '--f-sizing-control-lg': foundation.sizing.control.lg,
  '--f-sizing-control-md': foundation.sizing.control.md,
  '--f-sizing-control-sm': foundation.sizing.control.sm,
  '--f-sizing-control-xs': foundation.sizing.control.xs,

  // Sizing — squares (Icon button / Avatar)
  '--f-sizing-square-filter':  foundation.sizing.square.filter,
  '--f-sizing-square-control': foundation.sizing.square.control,
  '--f-sizing-square-item':    foundation.sizing.square.item,
  '--f-sizing-square-barcode': foundation.sizing.square.barcode,
  '--f-sizing-square-status':  foundation.sizing.square.status,

  // Sizing — badge (static metadata, single size)
  '--f-sizing-badge-height':   foundation.sizing.badge.height,
  '--f-sizing-badge-padding-x': foundation.sizing.badge.paddingX,
  '--f-sizing-badge-gap':       foundation.sizing.badge.gap,

  // Sizing — pill (interactive)
  '--f-sizing-pill-interactive': foundation.sizing.pill.interactive,

  // Sizing — input (height via control; single padding-x)
  '--f-sizing-input-padding-x': foundation.sizing.input.paddingX,

  // Sizing — card (density-based; no fixed heights)
  '--f-sizing-card-padding-compact':     foundation.sizing.card.padding.compact,
  '--f-sizing-card-padding-comfortable': foundation.sizing.card.padding.comfortable,
  '--f-sizing-card-padding-spacious':    foundation.sizing.card.padding.spacious,
  '--f-sizing-card-gap-compact':         foundation.sizing.card.gap.compact,
  '--f-sizing-card-gap-comfortable':     foundation.sizing.card.gap.comfortable,
  '--f-sizing-card-gap-spacious':        foundation.sizing.card.gap.spacious,

  // Sizing — icon glyphs
  '--f-sizing-icon-xs':     foundation.sizing.icon.xs,
  '--f-sizing-icon-sm':     foundation.sizing.icon.sm,
  '--f-sizing-icon-inline': foundation.sizing.icon.inline,
  '--f-sizing-icon-md':     foundation.sizing.icon.md,
  '--f-sizing-icon-lg':     foundation.sizing.icon.lg,
} as const;
