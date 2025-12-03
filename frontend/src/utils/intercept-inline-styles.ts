/**
 * Inline Style Interceptor for CSP Compliance
 * 
 * This module intercepts inline style applications at the lowest level
 * to prevent CSP violations. Since React Bootstrap and BCGov components
 * use inline styles that are blocked by strict CSP, we prevent them
 * from being set in the first place.
 * 
 * The CSS we've defined should handle all necessary styling via classes.
 */

/**
 * Initialize inline style interception
 * Must be called before React renders
 */
export function interceptInlineStyles(): () => void {
  if (typeof window === 'undefined' || typeof HTMLElement === 'undefined') {
    return () => {}
  }

  // Store original implementations
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
  const originalSetAttribute = Element.prototype.setAttribute
  
  // Intercept CSSStyleDeclaration.setProperty (used by element.style.setProperty)
  // Note: CSP blocks inline styles before they're set, so this is a fallback
  const interceptedSetProperty = CSSStyleDeclaration.prototype.setProperty
  CSSStyleDeclaration.prototype.setProperty = function (
    property: string,
    value: string,
    priority?: string
  ): void {
    // Don't set inline styles - they're blocked by CSP and our CSS handles styling
    // This prevents console errors from attempted style applications
    return
  }
  
  // Intercept setAttribute for style attribute
  Element.prototype.setAttribute = function (
    qualifiedName: string,
    value: string
  ): void {
    if (qualifiedName.toLowerCase() === 'style') {
      // Don't set inline style attributes - blocked by CSP
      return
    }
    // Call original for all other attributes
    return originalSetAttribute.call(this, qualifiedName, value)
  }

  // MutationObserver as a fallback to catch any styles that slip through
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const target = mutation.target as HTMLElement
        if (target.hasAttribute('style')) {
          target.removeAttribute('style')
        }
      }
      
      // Also check for new nodes with style attributes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          if (element.hasAttribute('style')) {
            element.removeAttribute('style')
          }
          // Check children
          const styledChildren = element.querySelectorAll?.('[style]')
          styledChildren?.forEach((child) => {
            child.removeAttribute('style')
          })
        }
      })
    })
  })

  // Start observing after a brief delay to ensure DOM is ready
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      childList: true,
      subtree: true,
    })
  } else {
    // Wait for body to be available
    const checkBody = setInterval(() => {
      if (document.body) {
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['style'],
          childList: true,
          subtree: true,
        })
        clearInterval(checkBody)
      }
    }, 10)
  }

  // Return cleanup function
  return () => {
    CSSStyleDeclaration.prototype.setProperty = originalSetProperty
    Element.prototype.setAttribute = originalSetAttribute
    observer.disconnect()
  }
}

