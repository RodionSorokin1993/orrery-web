import { expect, test } from '@playwright/test'

test.describe('interactive chart (spec 003)', () => {
  test('is fully usable from the keyboard (AC2)', async ({ page }) => {
    await page.goto('/en')
    const plot = page.getByRole('group', { name: /Interactive line chart/ })
    const readout = page.locator('[aria-live="polite"]').first()

    await plot.focus()
    await expect(readout).toContainText('At 1K')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(readout).toContainText('At 4K')
    await expect(readout).toContainText('Apogee 75%')
    await page.keyboard.press('End')
    await expect(readout).toContainText('At 64K')
  })

  test('follows the pointer', async ({ page }) => {
    await page.goto('/en')
    const svg = page.getByRole('group', { name: /Interactive line chart/ }).locator('svg')
    await svg.scrollIntoViewIfNeeded()
    const box = await svg.boundingBox()
    if (!box) throw new Error('chart not rendered')

    await svg.hover({ position: { x: box.width - 25, y: box.height / 2 } })
    await expect(page.locator('[aria-live="polite"]').first()).toContainText('At 64K')
  })

  test('hides a series from the legend', async ({ page }) => {
    await page.goto('/en')
    const toggle = page.getByRole('button', { name: 'Show or hide Perigee' })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })
})
