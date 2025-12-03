/**
 * React Style Interceptor for CSP Compliance
 * 
 * This module patches React's internal DOM manipulation to prevent inline styles
 * from being set. This must run before React renders any components.
 */

/**
 * Patch React's DOM operations to filter out style attributes
 * This runs at a lower level than our previous interceptor
 */
export function patchReactDOMOperations(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {}
  }

  // Store original implementations
  const originalCreateElement = document.createElement.bind(document)
  
  // Patch createElement to intercept style attributes at creation
  document.createElement = function (
    tagName: string,
    options?: ElementCreationOptions
  ): HTMLElement {
    const element = originalCreateElement(tagName, options)
    
    // Wrap the setAttribute method for this specific element
    const originalSetAttribute = element.setAttribute.bind(element)
    element.setAttribute = function (
      qualifiedName: string,
      value: string
    ): void {
      if (qualifiedName.toLowerCase() === 'style') {
        // Silently ignore inline style attributes
        return
      }
      return originalSetAttribute(qualifiedName, value)
    }
    
    // Wrap style property setter
    const styleDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')
    if (styleDescriptor && styleDescriptor.get) {
      const originalStyleGetter = styleDescriptor.get
      const styleObj = originalStyleGetter.call(element) as CSSStyleDeclaration
      
      // Intercept setProperty on this element's style object
      const originalStyleSetProperty = styleObj.setProperty.bind(styleObj)
      styleObj.setProperty = function (
        property: string,
        value: string,
        priority?: string
      ): void {
        // Silently ignore - CSS classes handle all styling
        return
      }
    }
    
    return element
  }
  
  // Return cleanup function
  return () => {
    document.createElement = originalCreateElement
  }
}

/**
 * Comprehensive inline style blocker
 * Combines multiple interception methods
 */
export function blockAllInlineStyles(): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const cleanups: Array<() => void> = []
  
  // Method 1: Patch CSSStyleDeclaration.setProperty globally
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
  CSSStyleDeclaration.prototype.setProperty = function (
    property: string,
    value: string,
    priority?: string
  ): void {
    // Block all inline style property setting
    return
  }
  cleanups.push(() => {
    CSSStyleDeclaration.prototype.setProperty = originalSetProperty
  })
  
  // Method 2: Patch Element.setAttribute globally
  const originalSetAttribute = Element.prototype.setAttribute
  Element.prototype.setAttribute = function (
    qualifiedName: string,
    value: string
  ): void {
    if (qualifiedName.toLowerCase() === 'style') {
      return
    }
    return originalSetAttribute.call(this, qualifiedName, value)
  }
  cleanups.push(() => {
    Element.prototype.setAttribute = originalSetAttribute
  })
  
  // Method 3: Patch createElement
  const createElementCleanup = patchReactDOMOperations()
  cleanups.push(createElementCleanup)
  
  // Method 4: MutationObserver to remove any style attributes that get set
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Remove style attributes
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const target = mutation.target as HTMLElement
        if (target.hasAttribute('style')) {
          target.removeAttribute('style')
        }
      }
      
      // Check newly added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          if (element.hasAttribute('style')) {
            element.removeAttribute('style')
          }
          // Check all descendants
          const styledElements = element.querySelectorAll?.('[style]')
          styledElements?.forEach((el) => {
            el.removeAttribute('style')
          })
        }
      })
    })
  })
  
  // Start observing when body is available
  const startObserving = () => {
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style'],
        childList: true,
        subtree: true,
      })
    } else {
      setTimeout(startObserving, 10)
    }
  }
  startObserving()
  
  cleanups.push(() => {
    observer.disconnect()
  })
  
  // Return combined cleanup
  return () => {
    cleanups.forEach((cleanup) => cleanup())
  }
}

