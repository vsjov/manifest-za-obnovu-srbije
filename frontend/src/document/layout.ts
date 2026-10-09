// Functions
// -----------------------------------------------------------------------------
/**
 * Starts the sticky-header offset observer after appearance initialization.
 *
 * Page startup calls this once. The initial measurement and later font,
 * control, or viewport reflows publish the same CSS custom property used by
 * anchor scrolling. A page without a header is left unchanged.
 *
 * @returns No value; publishes the offset and retains an observer for this document.
 */
export const observeHeaderHeight = (): void => {
  const header = document.querySelector('header')
  if (!header) return

  /**
   * Publishes the captured header's current height for CSS anchor offsets.
   *
   * The enclosing initializer calls this immediately and reuses it as the
   * ResizeObserver callback so both paths measure the same rendered element.
   *
   * @returns No value; writes --header-height on the root element in pixels.
   */
  const publishHeaderHeight = (): void => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
  }

  publishHeaderHeight()
  new ResizeObserver(publishHeaderHeight).observe(header)
}

/**
 * Joins the sources heading and appended citations during page startup.
 *
 * Pannonico emits the list outside its heading wrappers. In these pages the
 * only empty level-two wrapper is the sources heading. Move the existing
 * nodes into that wrapper so citation IDs, links, and backlinks remain valid
 * in every language. CSS preserves reading order when JavaScript is disabled.
 *
 * @returns No value; groups and labels the region, or leaves missing markup unchanged.
 */
export const groupSources = (): void => {
  const footnotes = document.querySelector('main > .footnotes')
  const sources = document.querySelector('main .section-headline-2:has(> h2:only-child)')
  const heading = sources?.querySelector('h2')
  if (!footnotes || !sources || !heading) return

  document.querySelector('main > .footnotes-sep')?.remove()
  sources.append(footnotes)
  sources.setAttribute('role', 'region')
  sources.setAttribute('aria-labelledby', heading.id)
}
