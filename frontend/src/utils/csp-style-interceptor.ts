/**
 * CSP Style Interceptor
 * 
 * Intercepts inline style application and converts to CSS classes
 * to comply with Content Security Policy (no 'unsafe-inline').
 * 
 * This runs before React mounts to catch all inline style operations.
 */

// Map of inline styles to CSS classes
const styleToClassMap = new Map<string, string>()
let styleCounter = 0

// Generate a unique class name for a given style string
function getClassForStyle(styleString: string): string {
  if (styleToClassMap.has(styleString)) {
    return styleToClassMap.get(styleString)!
  }
  
  const className = `csp-style-${styleCounter++}`
  styleToClassMap.set(styleString, className)
  
  // Inject CSS rule
  if (!document.getElementById('csp-dynamic-styles')) {
    const styleElement = document.createElement('style')
    styleElement.id = 'csp-dynamic-styles'
    document.head.appendChild(styleElement)
  }
  
  const styleElement = document.getElementById('csp-dynamic-styles') as HTMLStyleElement
  const cssRule = `.${className} { ${styleString} }`
  styleElement.textContent = (styleElement.textContent || '') + '\n' + cssRule
  
  return className
}

// Intercept element.style.setProperty - MUST run before any other code
const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
CSSStyleDeclaration.prototype.setProperty = function(property: string, value: string, priority?: string) {
  // Get the element this style belongs to
  const element = (this as any).parentElement as HTMLElement | null
  
  // Only intercept if this is an inline style (not a CSS rule)
  if (element && this.parentRule === null && element.nodeType === 1) {
    // Build style string for just this property
    const styleString = `${property}: ${value}${priority === 'important' ? ' !important' : ''}`
    
    // Convert to class
    const className = getClassForStyle(styleString)
    
    // Apply class immediately
    element.classList.add(className)
    
    // CRITICAL: Don't call original - this prevents the inline style from being applied
    // which would violate CSP
    return undefined
  }
  
  // For CSS rules (not inline), call original
  return originalSetProperty.call(this, property, value, priority)
}

// Also intercept the style attribute directly via MutationObserver
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement
          const styleAttr = target.getAttribute('style')
          if (styleAttr) {
            // Convert to class
            const className = getClassForStyle(styleAttr)
            target.classList.add(className)
            target.removeAttribute('style')
          }
        }
      })
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    })
  })
} else if (typeof window !== 'undefined') {
  // DOM already loaded, observe immediately
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const target = mutation.target as HTMLElement
        const styleAttr = target.getAttribute('style')
        if (styleAttr) {
          const className = getClassForStyle(styleAttr)
          target.classList.add(className)
          target.removeAttribute('style')
        }
      }
    })
  })
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['style'],
    subtree: true,
  })
}

// Intercept direct style property assignment (e.g., element.style.display = 'block')
const styleDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style') ||
                        Object.getOwnPropertyDescriptor(Element.prototype, 'style')

if (styleDescriptor && styleDescriptor.get) {
  const originalStyleGetter = styleDescriptor.get
  
  Object.defineProperty(HTMLElement.prototype, 'style', {
    get: function() {
      const style = originalStyleGetter!.call(this) as CSSStyleDeclaration
      // Wrap the style object to intercept setProperty calls
      return new Proxy(style, {
        set(target, prop, value) {
          if (typeof prop === 'string' && prop !== 'setProperty' && prop !== 'length') {
            // Convert property assignment to setProperty call
            const property = prop.replace(/([A-Z])/g, '-$1').toLowerCase()
            target.setProperty(property, String(value))
            return true
          }
          return Reflect.set(target, prop, value)
        },
      })
    },
    configurable: true,
  })
}

