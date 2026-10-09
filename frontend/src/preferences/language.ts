// Constants
// -----------------------------------------------------------------------------
const STORAGE_LANGUAGE = 'ssb-language'

// Functions
// -----------------------------------------------------------------------------
/**
 * Matches one browser preference against the available rendered editions.
 *
 * Language detection calls this for each preference in browser order. Region
 * variants share an edition, explicit scripts must match, and scriptless
 * Serbian uses Latin. A malformed browser tag permits the next preference.
 *
 * @param language - Browser BCP 47 tag, such as en-US or sr-Cyrl-RS.
 * @param availableCodes - Valid edition codes from the current page and its
 * translation links, with the current edition first.
 * @returns The matching edition code, or undefined for an unsupported or malformed tag.
 * @throws {RangeError} If an edition code supplied by the site is an invalid locale.
 */
const matchLanguage = (language: string, availableCodes: string[]): string | undefined => {
  let requested: Intl.Locale
  try {
    requested = new Intl.Locale(language)
  } catch {
    return undefined
  }

  const script = requested.script ?? (requested.language === 'sr' ? 'Latn' : undefined)
  return availableCodes.find((code) => {
    const available = new Intl.Locale(code)
    return available.language === requested.language
      && (!script || script === (available.script ?? available.maximize().script))
  })
}

/**
 * Reads the last manual language for directory-entry negotiation.
 *
 * Startup validates storage against the rendered editions so stale values
 * cannot route to a removed language. Denied storage permits browser fallback.
 *
 * @param availableCodes - Edition codes currently rendered by this page and its translations.
 * @returns A supported saved edition, or null for missing, unsupported, or denied storage.
 */
const readLanguagePreference = (availableCodes: string[]): string | null => {
  try {
    const code = localStorage.getItem(STORAGE_LANGUAGE)
    return code && availableCodes.includes(code) ? code : null
  } catch {
    return null
  }
}

/**
 * Remembers a manual translation-link selection before native navigation.
 *
 * Link handlers call this for normal, keyboard, modified, and middle clicks.
 * A denied write must not prevent navigation to the explicit edition URL.
 *
 * @param code - Supported edition code supplied by the activated link's hreflang.
 * @returns No value; attempts to save the manual choice without changing navigation.
 */
const saveLanguagePreference = (code: string): void => {
  try {
    localStorage.setItem(STORAGE_LANGUAGE, code)
  } catch {
    // The explicit edition URL still honors the choice when storage is denied.
  }
}

/**
 * Initializes manual language persistence and directory-entry negotiation.
 *
 * Page startup calls this once. Register native translation-link handlers in
 * every edition; explicit file routes and fragments retain their destination.
 * On the directory entry, prefer a supported saved manual choice, then ordered
 * browser preferences, then Latin. Rendered target URLs preserve deployment
 * prefixes. Inferred choices are not persisted as manual selections.
 *
 * @returns No value; registers document-lifetime handlers and may replace the location.
 */
export const initializeLanguage = (): void => {
  const currentCode = document.documentElement.lang
  const currentUrl = new URL(window.location.href)
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.translation a[hreflang]')]
  for (const link of links) {
    link.addEventListener('click', () => saveLanguagePreference(link.hreflang))
    link.addEventListener('auxclick', (event) => {
      if (event.button === 1) saveLanguagePreference(link.hreflang)
    })
  }

  if (currentCode !== 'sr-Latn' || !currentUrl.pathname.endsWith('/') || currentUrl.hash) return

  const availableCodes = [currentCode, ...links.map((link) => link.hreflang)]
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language]
  const code = readLanguagePreference(availableCodes)
    ?? preferences.map((preference) => matchLanguage(preference, availableCodes)).find(Boolean)
    ?? currentCode
  const link = links.find((translation) => translation.hreflang === code)
  if (link) {
    const target = new URL(link.href)
    target.search = currentUrl.search
    window.location.replace(target.href)
  }
}
