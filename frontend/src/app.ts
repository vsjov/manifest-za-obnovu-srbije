// Imports
// -----------------------------------------------------------------------------
// External
import 'vite/modulepreload-polyfill'

// Internal
import './styles/index.scss'
import { groupSources, observeHeaderHeight } from './document/layout'
import { initializeAppearance } from './preferences/appearance'
import { initializeLanguage } from './preferences/language'

// Functions
// -----------------------------------------------------------------------------
/**
 * Runs once after DOM readiness to coordinate the browser modules.
 *
 * Resolve the route first and group citations before applying appearance.
 * Measure the header after the initial font preference so sticky-header
 * anchor offsets use the displayed layout.
 *
 * @returns No value; initializes document layout and lifetime control listeners.
 */
const initializePage = (): void => {
  initializeLanguage()
  groupSources()
  initializeAppearance()
  observeHeaderHeight()
}

// Entrypoint
// -----------------------------------------------------------------------------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage)
} else {
  initializePage()
}
