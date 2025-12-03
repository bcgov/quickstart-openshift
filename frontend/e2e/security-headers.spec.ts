import { test, expect } from '@playwright/test'
import { baseURL } from './utils'

test.describe('Security Headers', () => {
  test('should have correct Content-Security-Policy header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const cspHeader = response?.headers()['content-security-policy']
    expect(cspHeader).toBeDefined()
    expect(cspHeader).toBeTruthy()

    // Security: Verify CSP does not contain unsafe-inline (XSS attack vector)
    expect(cspHeader).not.toContain("'unsafe-inline'")
    expect(cspHeader).not.toMatch(/style-src[^;]*'unsafe-inline'/)

    // Verify style-src directive is present and correctly configured
    expect(cspHeader).toContain("style-src")
    expect(cspHeader).toContain("'self'")
    expect(cspHeader).toContain('https://fonts.googleapis.com')
    expect(cspHeader).toContain('https://use.fontawesome.com')
    
    // Verify style-src does not have unsafe-inline
    const styleSrcMatch = cspHeader.match(/style-src\s+([^;]+)/)
    expect(styleSrcMatch).toBeTruthy()
    if (styleSrcMatch) {
      const styleSrcDirective = styleSrcMatch[1]
      expect(styleSrcDirective).not.toContain("'unsafe-inline'")
    }

    // Verify syntax correctness - no double semicolons
    expect(cspHeader).not.toContain(';;')
    
    // Verify other key directives are present
    expect(cspHeader).toContain("default-src")
    expect(cspHeader).toContain("script-src")
    expect(cspHeader).toContain("font-src")
    expect(cspHeader).toContain("img-src")
    expect(cspHeader).toContain("frame-ancestors")
    expect(cspHeader).toContain("form-action")
    expect(cspHeader).toContain("block-all-mixed-content")
    expect(cspHeader).toContain("connect-src")

    // Verify default-src directive
    expect(cspHeader).toMatch(/default-src\s+'self'\s+https:\/\/\*\.gov\.bc\.ca/)
    
    // Verify script-src directive
    expect(cspHeader).toMatch(/script-src\s+'self'\s+https:\/\/\*\.gov\.bc\.ca/)
    
    // Verify frame-ancestors restricts to self only
    expect(cspHeader).toMatch(/frame-ancestors\s+'self'/)
    
    // Verify form-action restricts to self only
    expect(cspHeader).toMatch(/form-action\s+'self'/)
  })

  test('should have X-Frame-Options header set to SAMEORIGIN', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const xFrameOptions = response?.headers()['x-frame-options']
    expect(xFrameOptions).toBe('SAMEORIGIN')
  })

  test('should have X-Content-Type-Options header set to nosniff', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const xContentTypeOptions = response?.headers()['x-content-type-options']
    expect(xContentTypeOptions).toBe('nosniff')
  })

  test('should have Strict-Transport-Security header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const hsts = response?.headers()['strict-transport-security']
    expect(hsts).toBeDefined()
    expect(hsts).toContain('max-age=31536000')
  })

  test('should have Referrer-Policy header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const referrerPolicy = response?.headers()['referrer-policy']
    expect(referrerPolicy).toBe('same-origin')
  })

  test('should have Permissions-Policy header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const permissionsPolicy = response?.headers()['permissions-policy']
    expect(permissionsPolicy).toBeDefined()
    expect(permissionsPolicy).toContain('fullscreen=(self)')
  })

  test('should have Cross-Origin-Resource-Policy header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const corPolicy = response?.headers()['cross-origin-resource-policy']
    expect(corPolicy).toBe('cross-origin')
  })

  test('should have Cross-Origin-Opener-Policy header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const coop = response?.headers()['cross-origin-opener-policy']
    expect(coop).toBe('same-origin')
  })

  test('should have Cache-Control header for security', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const cacheControl = response?.headers()['cache-control']
    expect(cacheControl).toBeDefined()
    expect(cacheControl).toContain('no-store')
    expect(cacheControl).toContain('no-cache')
    expect(cacheControl).toContain('must-revalidate')
  })

  test('should not expose Server header', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    // Server header should be removed (-Server directive in Caddyfile)
    const serverHeader = response?.headers()['server']
    expect(serverHeader).toBeUndefined()
  })

  test('should have valid CSP syntax without double semicolons', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const cspHeader = response?.headers()['content-security-policy']
    expect(cspHeader).toBeDefined()

    // Verify no double semicolons (syntax error)
    expect(cspHeader).not.toContain(';;')
    
    // Verify proper semicolon separation between directives
    // Each directive should end with a semicolon (except the last one)
    const directives = cspHeader.split(';').filter(d => d.trim().length > 0)
    expect(directives.length).toBeGreaterThan(5) // Should have multiple directives
    
    // Verify each directive has a valid format (directive-name value(s))
    directives.forEach(directive => {
      const trimmed = directive.trim()
      expect(trimmed).toMatch(/^[a-z-]+/)
    })
  })

  test('should enforce strict CSP without unsafe directives', async ({ page }) => {
    const response = await page.goto(baseURL)
    expect(response).not.toBeNull()

    const cspHeader = response?.headers()['content-security-policy']
    expect(cspHeader).toBeDefined()

    // Verify no unsafe-inline anywhere in CSP
    expect(cspHeader).not.toContain("'unsafe-inline'")
    
    // Verify no unsafe-eval (should not be present for security)
    expect(cspHeader).not.toContain("'unsafe-eval'")
    
    // Verify block-all-mixed-content is present
    expect(cspHeader).toContain('block-all-mixed-content')
  })
})

