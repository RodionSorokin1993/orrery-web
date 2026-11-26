import { expect, test } from '@playwright/test'

const pages = [
  '/en',
  '/en/models',
  '/es/modelos',
  '/en/blog',
  '/en/blog/introducing-apogee',
  '/es/nosotros',
]

test.describe('layout (spec 006, AC4)', () => {
  for (const path of pages) {
    test(`${path} does not scroll sideways @mobile`, async ({ page }) => {
      await page.goto(path)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth, `page is ${scrollWidth - clientWidth}px wider than the viewport`).toBe(
        clientWidth,
      )
    })
  }
})
