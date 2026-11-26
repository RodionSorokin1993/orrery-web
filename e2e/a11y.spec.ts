import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  '/en',
  '/en/models',
  '/en/blog',
  '/en/blog/introducing-apogee',
  '/es',
  '/es/nosotros',
]

test.describe('accessibility (spec 006, AC3)', () => {
  for (const path of pages) {
    test(`${path} has no axe violations @mobile`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
    })
  }

  test('dark theme has no contrast violations', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
    expect(results.violations).toEqual([])
    await context.close()
  })

  test('skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/en')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await skip.press('Enter')
    await expect(page.locator('main')).toBeFocused()
  })
})
