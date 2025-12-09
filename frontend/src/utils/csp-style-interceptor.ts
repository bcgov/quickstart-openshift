/**
 * CSP Style Interceptor
 * 
 * Intercepts inline style application and converts to CSS classes
 * to comply with Content Security Policy (no 'unsafe-inline').
 * 
 * This MUST run before React mounts to catch all inline style operations.
 * Intercepts: setAttribute('style', ...), element.style.setProperty, element.style.property = value
 */

// Map of inline styles to CSS classes
const styleToClassMap = new Map<string, string>()
let styleCounter = 0

// Ensure style element exists
function ensureStyleElement(): HTMLStyleElement {
  let styleElement = document.getElementById('csp-dynamic-styles') as HTMLStyleElement
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'csp-dynamic-styles'
    document.head.appendChild(styleElement)
  }
  return styleElement
}

// Generate a unique class name for a given style string
function getClassForStyle(styleString: string): string {
  // Normalize the style string (trim, remove extra spaces)
  const normalized = styleString.trim().replace(/\s+/g, ' ').replace(/;\s*;/g, ';')
  
  if (styleToClassMap.has(normalized)) {
    return styleToClassMap.get(normalized)!
  }
  
  const className = `csp-style-${styleCounter++}`
  styleToClassMap.set(normalized, className)
  
  // Inject CSS rule
  const styleElement = ensureStyleElement()
  const cssRule = `.${className} { ${normalized} }`
  styleElement.textContent = (styleElement.textContent || '') + '\n' + cssRule
  
  return className
}

// Convert inline style string to class and apply
function convertStyleToClass(element: HTMLElement, styleValue: string): void {
  if (!styleValue || !styleValue.trim()) {
    return
  }
  
  const className = getClassForStyle(styleValue)
  element.classList.add(className)
}

// CRITICAL: Intercept setAttribute BEFORE anything else - React uses this
const originalSetAttribute = Element.prototype.setAttribute
Element.prototype.setAttribute = function(name: string, value: string) {
  // Synchronously intercept style attribute before it's set
  if (name === 'style' && this instanceof HTMLElement && value) {
    convertStyleToClass(this as HTMLElement, value)
    // DON'T call original - this prevents the style attribute from being set
    // which would trigger CSP violation
    return
  }
  
  // For all other attributes, call original
  return originalSetAttribute.call(this, name, value)
}

// Intercept element.style.setProperty
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
    return undefined
  }
  
  // For CSS rules (not inline), call original
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

