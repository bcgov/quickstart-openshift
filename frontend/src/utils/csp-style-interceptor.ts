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

// Intercept element.style.setProperty
const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
CSSStyleDeclaration.prototype.setProperty = function(property: string, value: string, priority?: string) {
  // For CSP compliance, we need to block inline styles
  // Instead, we'll convert to CSS classes
  // This is a workaround - ideally libraries shouldn't use inline styles
  
  // Get all current inline styles
  const styles: string[] = []
  for (let i = 0; i < this.length; i++) {
    const prop = this[i]
    styles.push(`${prop}: ${this.getPropertyValue(prop)}`)
  }
  
  // Add the new style
  styles.push(`${property}: ${value}${priority ? ' !important' : ''}`)
  const styleString = styles.join('; ')
  
  // Convert to class
  const className = getClassForStyle(styleString)
  
  // Apply class instead of inline style
  if (this.parentRule === null && (this as any).parentElement) {
    const element = (this as any).parentElement as HTMLElement
    element.classList.add(className)
    // Clear inline styles
    element.removeAttribute('style')
  }
  
  // Still call original for libraries that expect it to work
  return originalSetProperty.call(this, property, value, priority)
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

