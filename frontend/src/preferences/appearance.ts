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
 * Reads a stored appearance value for the validated preference readers.
 *
 * Keep storage access at this boundary so browsers that deny it still allow
 * startup and controls to use their system or default settings.
 *
 * @param key - Exact localStorage key owned by the appearance controls.
 * @returns The saved string, or null when the key is missing or storage is denied.
 */
const readPreference = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Attempts to persist a manual theme or font choice from a control handler.
 *
 * The caller applies the choice independently. Storage policy failures are
 * ignored so presentation controls remain usable in the current document.
 *
 * @param key - Exact localStorage key for the chosen appearance preference.
 * @param value - Validated manual choice to save as a string under that key.
 * @returns No value; attempts persistence without blocking the caller's update.
 */
const savePreference = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // The current page still honors the choice when persistence is unavailable.
  }
}

/**
 * Resolves the operating-system scheme for startup and media-query changes.
 *
 * Use this only when no valid manual preference owns the current theme;
 * the inferred result must not be saved as a manual override.
 *
 * @returns Dark when the system requests it, otherwise light.
 */
const getOsTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/**
 * Validates the saved theme before startup or a system-change handler uses it.
 *
 * Unrecognized stored strings are treated as absent so the operating-system
 * preference remains the fallback rather than becoming invalid application state.
 *
 * @returns A saved light or dark choice, or null for missing, invalid, or denied storage.
 */
const readThemePreference = (): Theme | null => {
  const theme = readPreference(STORAGE_THEME)
  return theme === 'light' || theme === 'dark' ? theme : null
}

/**
 * Validates the saved reading scale during appearance initialization.
 *
 * Startup uses the medium default when this reader cannot provide a valid
 * choice. The reader never repairs or writes storage while inspecting it.
 *
 * @returns A saved small, medium, or large choice, or null when unavailable or invalid.
 */
const readFontSizePreference = (): FontSize | null => {
  const fontSize = readPreference(STORAGE_FONT_SIZE)
  return fontSize === 'small' || fontSize === 'medium' || fontSize === 'large'
    ? fontSize
    : null
}

/**
 * Applies a resolved scheme for startup, control clicks, or system changes.
 *
 * Keeping DOM mutation separate from persistence prevents a system-derived
 * scheme from accidentally becoming a manual preference.
 *
 * @param theme - Validated light or dark scheme chosen by the caller.
 * @returns No value; updates the root theme and action label without saving a preference.
 */
const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset['theme'] = theme

  const button = document.getElementById('theme-toggle')
  if (button) button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode'
}

/**
 * Applies the validated reading scale and its matching control state.
 *
 * Startup and click handlers share this DOM update so the stylesheet and
 * active button always describe the same selection. Persistence belongs to
 * the manual click handler.
 *
 * @param fontSize - Small, medium, or large reading scale; startup defaults to medium.
 * @returns No value; updates the root font-size setting and active buttons.
 */
const applyFontSize = (fontSize: FontSize): void => {
  document.documentElement.dataset['fontSize'] = fontSize

  document.querySelectorAll<HTMLButtonElement>('button[data-font-size]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset['fontSize'] === fontSize)
  })
}

/**
 * Initializes theme and font controls once from page startup.
 *
 * Apply saved preferences before the app measures header offsets. Without a
 * valid saved theme, use the system scheme and follow later system changes.
 * Manual theme state stays in memory when storage is denied; system changes
 * also respect choices persisted by another tab. Inferred themes are not saved.
 *
 * @returns No value; applies initial presentation and registers document-lifetime handlers.
 */
export const initializeAppearance = (): void => {
  let themePreference = readThemePreference()
  applyTheme(themePreference ?? getOsTheme())
  applyFontSize(readFontSizePreference() ?? DEFAULT_FONT_SIZE)

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const nextTheme: Theme = document.documentElement.dataset['theme'] === 'dark'
      ? 'light'
      : 'dark'

    themePreference = nextTheme
    savePreference(STORAGE_THEME, nextTheme)
    applyTheme(nextTheme)
  })

  document.querySelectorAll<HTMLButtonElement>('button[data-font-size]').forEach((button) => {
    button.addEventListener('click', () => {
      const fontSize = button.dataset['fontSize']
      if (fontSize !== 'small' && fontSize !== 'medium' && fontSize !== 'large') return

      savePreference(STORAGE_FONT_SIZE, fontSize)
      applyFontSize(fontSize)
    })
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!(themePreference ?? readThemePreference())) applyTheme(getOsTheme())
  })
}
