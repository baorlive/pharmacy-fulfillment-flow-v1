// CSS custom-property map — written to src/app/tokens/component.css; component-scoped layout/control values
export const componentCssVars = {
  // App chrome and layout details
  '--c-topbar-height': '52px',
  '--c-topbar-logo-height': '30px',
  '--c-active-indicator-size': '2px',
  '--c-scrollbar-w': '2px',
  '--c-scroll-shadow-height': '14px',
  '--c-focus-size': '1px',
  '--c-focus-gap':  'var(--s-space-1)',

  // Control sizing: Button / Input / Select — fixed-height interactive controls
  '--c-control-height':         'var(--s-sizing-control-lg)',
  '--c-control-height-compact': 'var(--s-sizing-control-md)',
  '--c-control-height-sm':      'var(--s-sizing-control-sm)',
  '--c-control-height-xs':      'var(--s-sizing-control-xs)',
  '--c-control-send-min-width': '84px',

  // Square sizing: Avatar / Icon button — square affordances
  '--c-square-control-size':          'var(--s-sizing-square-control)',
  '--c-square-filter-control-size':   'var(--s-sizing-square-filter)',
  '--c-square-status-icon-size':      'var(--s-sizing-square-status)',
  '--c-square-item-icon-size':        'var(--s-sizing-square-item)',
  '--c-square-barcode-item-icon-size':'var(--s-sizing-square-barcode)',

  // Icon glyph sizing
  '--c-icon-xs':     'var(--s-sizing-icon-xs)',
  '--c-icon-sm':     'var(--s-sizing-icon-sm)',
  '--c-icon-inline': 'var(--s-sizing-icon-inline)',
  '--c-icon-md':     'var(--s-sizing-icon-md)',
  '--c-icon-lg':     'var(--s-sizing-icon-lg)',
  '--c-icon-stroke-lg': '1.9',

  // Toggle controls
  '--c-switch-track-width': '34px',
  '--c-switch-track-height': '18px',
  '--c-switch-thumb-size': '14px',
  '--c-switch-thumb-offset': '1px',
  '--c-switch-thumb-translate': '16px',

  // Badge sizing: single unified size
  '--c-label-height':           'var(--s-sizing-badge-height)',
  '--c-label-tab-min-width':    '20px',
  '--c-label-inline-min-width': '10px',
  '--c-badge-padding-x':        'var(--s-sizing-badge-padding-x)',
  '--c-badge-gap':               'var(--s-sizing-badge-gap)',

  // Input sizing: single padding-x (height comes from control tokens)
  '--c-input-padding-x': 'var(--s-sizing-input-padding-x)',

  // Interactive pills/chips need more hit area than static labels
  '--c-chip-filter-width':        '148px',
  '--c-chip-dropdown-min-width':  '160px',
  '--c-chip-dropdown-caret-size': '10px',
  '--c-pill-interactive-height':  'var(--s-sizing-pill-interactive)',

  // Search and list layout
  '--c-search-fallback-width': '360px',
  '--c-search-icon-offset': '10px',
  '--c-row-min-height': '132px',
  '--c-row-padding':    'var(--s-space-8)',
  '--c-row-bg':         'var(--s-row-default)',
  '--c-row-active-indicator-width': '8px',
  '--c-row-summary-max-width': '700px',
  '--c-message-own-max-width': '82%',
  '--c-item-price-min-width': '70px',
  '--c-item-exp-min-width':  '80px',
  '--c-search-expanded':  '480px',

  // Container sizing: panels, drawers, modals, and previews
  '--c-panel-list-min-width': '400px',
  '--c-panel-detail-width':     '36vw',
  '--c-panel-detail-min-width': '320px',
  '--c-drawer-incoming-width': '440px',
  '--c-drawer-incoming-summary-min-height': '170px',
  '--c-modal-reject-width': '460px',
  '--c-modal-prescription-width': '560px',
  '--c-modal-barcode-width': '900px',
  '--c-modal-barcode-max-width-vw': '96vw',
  '--c-modal-barcode-max-height': '700px',
  '--c-modal-barcode-max-height-vh': '86vh',
  '--c-preview-prescription-min-height': '300px',
  '--c-preview-prescription-line-height': '10px',
  '--c-barcode-exp-max-width': '90px',
  '--c-barcode-action-hide-offset': '6px',
  '--c-barcode-cancel-min-width': '148px',

  // Local stacking contexts
  '--c-z-row-active': '30',
  '--c-z-dropdown': '40',
  '--c-z-filters': '60',
  '--c-z-toast': '500',
  '--c-z-incoming-popup': '700',
  '--c-z-reject-popup': '708',
  '--c-z-prescription-popup': '709',
  '--c-z-barcode-popup': '710',
} as const;
