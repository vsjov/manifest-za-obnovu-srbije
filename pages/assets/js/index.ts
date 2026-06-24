// Site controls: theme toggle + font-size switcher
// State is persisted in localStorage and applied before first paint via the
// inline <script> in head.html. This module wires up the interactive buttons.

type Theme = 'light' | 'dark'
type FontSize = 'small' | 'medium' | 'large'

const STORAGE_THEME = 'ssb-theme'
const STORAGE_FONT_SIZE = 'ssb-font-size'
const DEFAULT_FONT_SIZE: FontSize = 'medium'

// ── Helpers ──────────────────────────────────────────────────────────────────

const getOsTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const resolvedTheme = (): Theme =>
  (localStorage.getItem(STORAGE_THEME) as Theme | null) ?? getOsTheme()

const resolvedFontSize = (): FontSize =>
  (localStorage.getItem(STORAGE_FONT_SIZE) as FontSize | null) ?? DEFAULT_FONT_SIZE

// ── Apply ────────────────────────────────────────────────────────────────────

const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_THEME, theme)

  const btn = document.getElementById('theme-toggle')
  if (btn) btn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode'
}

const applyFontSize = (size: FontSize): void => {
  document.documentElement.setAttribute('data-font-size', size)
  localStorage.setItem(STORAGE_FONT_SIZE, size)

  document.querySelectorAll<HTMLButtonElement>('[data-font-size]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset['fontSize'] === size)
  })
}

/**
 * Mirrors the site header's rendered height into the `--header-height` CSS
 * custom property on `:root` so stylesheets can offset anchor-jump targets
 * (e.g. footnote citations and back-links) below the header via
 * `scroll-padding-top: var(--header-height)`.
 *
 * A {@link ResizeObserver} keeps the value in sync across viewport changes,
 * font-size switches, and any other reflow that resizes the header — no
 * hard-coded breakpoints or media queries required.
 *
 * No-ops when the page has no `<header>` element.
 */
const observeHeaderHeight = (): void => {
  const header = document.querySelector('header')
  if (!header) return

  const publish = (): void => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
  }

  publish()
  new ResizeObserver(publish).observe(header)
}

// ── Init ─────────────────────────────────────────────────────────────────────

const init = (): void => {
  applyTheme(resolvedTheme())
  applyFontSize(resolvedFontSize())
  observeHeaderHeight()

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next: Theme = resolvedTheme() === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  })

  // Font-size buttons
  document.querySelectorAll<HTMLButtonElement>('[data-font-size]').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset['fontSize'] as FontSize
      if (size) applyFontSize(size)
    })
  })

  // Keep in sync when the OS theme changes and the user has not manually overridden
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem(STORAGE_THEME)) {
      applyTheme(getOsTheme())
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
