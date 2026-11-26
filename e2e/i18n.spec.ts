import { expect, test } from '@playwright/test'

test.describe('internationalization (spec 002)', () => {
  test('redirects to the reader’s language (AC1)', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'es-MX',
      extraHTTPHeaders: { 'Accept-Language': 'es-MX,es;q=0.9' },
    })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveURL(/\/es$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await context.close()
  })

  test('keeps a locale-less path when redirecting', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/en\/blog$/)
  })

  test('switches language on the same document and remembers it (AC2, AC3)', async ({ page }) => {
    await page.goto('/en/models')
    await page.getByRole('link', { name: 'ES, Español' }).first().click()

    await expect(page).toHaveURL(/\/es\/modelos$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Tres modelos, una misma forma de pensar',
    )

    // The choice is stored, so a locale-less URL now goes to Spanish.
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/es\/blog$/)
  })

  test('maps localized post slugs', async ({ page }) => {
    await page.goto('/es/blog/presentamos-apogee')
    await page.getByRole('link', { name: 'EN, English' }).first().click()
    await expect(page).toHaveURL(/\/en\/blog\/introducing-apogee$/)
  })

  test('emits hreflang alternates', async ({ page }) => {
    await page.goto('/en/about')
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      /\/es\/nosotros$/,
    )
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      /\/en\/about$/,
    )
  })
})
