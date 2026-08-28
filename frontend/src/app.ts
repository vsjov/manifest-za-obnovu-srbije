// Imports
// -----------------------------------------------------------------------------
import 'vite/modulepreload-polyfill'
import './styles/index.scss'

// Types
// -----------------------------------------------------------------------------
type Theme = 'light' | 'dark'
type FontSize = 'small' | 'medium' | 'large'

// Constants
// -----------------------------------------------------------------------------
const STORAGE_THEME = 'ssb-theme'
const STORAGE_FONT_SIZE = 'ssb-font-size'
const DEFAULT_FONT_SIZE: FontSize = 'medium'

// Functions
// -----------------------------------------------------------------------------
/**
 * Resolves the operating system color preference used when the visitor has
 * not selected and stored a site-specific theme.
 */
const getOsTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/**
 * Reads a valid visitor-selected theme without treating malformed storage as
 * an application preference.
 */
const readThemePreference = (): Theme | null => {
  const theme = localStorage.getItem(STORAGE_THEME)
  return theme === 'light' || theme === 'dark' ? theme : null
}

/**
 * Reads a valid visitor-selected font size so initialization and reloads use
 * the same constrained control state.
 */
const readFontSizePreference = (): FontSize | null => {
  const fontSize = localStorage.getItem(STORAGE_FONT_SIZE)
  return fontSize === 'small' || fontSize === 'medium' || fontSize === 'large'
    ? fontSize
    : null
}

/**
 * Applies one resolved theme to the document and updates the control label.
 * Preference persistence remains with the user event that chose the theme so
 * an operating system fallback does not become a manual override.
 */
const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset['theme'] = theme

  const button = document.getElementById('theme-toggle')
  if (button) button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode'
}

/**
 * Applies one validated font-size choice and exposes the active state to both
 * the stylesheet and the three header controls.
 */
const applyFontSize = (fontSize: FontSize): void => {
  document.documentElement.dataset['fontSize'] = fontSize

  document.querySelectorAll<HTMLButtonElement>('button[data-font-size]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset['fontSize'] === fontSize)
  })
}

/**
 * Mirrors the rendered header height into a root custom property so anchor
 * navigation remains visible below the sticky header after any reflow.
 */
const observeHeaderHeight = (): void => {
  const header = document.querySelector('header')
  if (!header) return

  /** Publishes the current header height for CSS anchor offsets. */
  const publishHeaderHeight = (): void => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
  }

  publishHeaderHeight()
  new ResizeObserver(publishHeaderHeight).observe(header)
}

/**
 * Initializes persisted presentation controls and browser observers after the
 * document is ready, then wires user actions to their local preferences.
 */
const initializeControls = (): void => {
  applyTheme(readThemePreference() ?? getOsTheme())
  applyFontSize(readFontSizePreference() ?? DEFAULT_FONT_SIZE)
  observeHeaderHeight()

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const nextTheme: Theme = document.documentElement.dataset['theme'] === 'dark'
      ? 'light'
      : 'dark'

    localStorage.setItem(STORAGE_THEME, nextTheme)
    applyTheme(nextTheme)
  })

  document.querySelectorAll<HTMLButtonElement>('button[data-font-size]').forEach((button) => {
    button.addEventListener('click', () => {
      const fontSize = button.dataset['fontSize']
      if (fontSize !== 'small' && fontSize !== 'medium' && fontSize !== 'large') return

      localStorage.setItem(STORAGE_FONT_SIZE, fontSize)
      applyFontSize(fontSize)
    })
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!readThemePreference()) applyTheme(getOsTheme())
  })
}

// Entrypoint
// -----------------------------------------------------------------------------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeControls)
} else {
  initializeControls()
}
