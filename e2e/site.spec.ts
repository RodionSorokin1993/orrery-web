import { expect, test } from '@playwright/test'

test.describe('navigation', () => {
  test('marks the current section in the main navigation', async ({ page }) => {
    await page.goto('/en/blog/calibration-over-accuracy')
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'Research' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  test('opens and closes the mobile menu @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only')
    await page.goto('/en')
    const button = page.getByRole('button', { name: 'Open menu' })
    await button.click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()

    await button.click()
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'About' })
      .click()
    await expect(page).toHaveURL(/\/en\/about$/)
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  test('renders the localized not-found page', async ({ page }) => {
    const response = await page.goto('/es/models/does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta órbita está vacía')
  })
})

test.describe('theme', () => {
  test('cycles system, light and dark and remembers the choice', async ({ page }) => {
    await page.goto('/en')
    const html = page.locator('html')
    const toggle = page.getByRole('button', { name: /Color theme/ }).first()

    await expect(toggle).toHaveAccessibleName('Color theme: System theme')
    await toggle.click()
    await expect(html).toHaveAttribute('data-theme', 'light')
    await toggle.click()
    await expect(html).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })
})

test.describe('SEO (spec 004, AC3)', () => {
  test('serves generated Open Graph images', async ({ page, request }) => {
    await page.goto('/en/blog/introducing-apogee')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toBeTruthy()

    const response = await request.get(new URL(ogImage!).pathname)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')
  })

  test('publishes a sitemap with every locale', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('/en/models</loc>')
    expect(sitemap).toContain('/es/modelos</loc>')
    expect(sitemap).toContain('/es/blog/presentamos-apogee</loc>')
  })

  test('keeps the Studio out of search engines', async ({ request }) => {
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toContain('Disallow: /studio')
  })
})

test.describe('theme (spec 000, AC1)', () => {
  test('keeps the chosen theme after switching language', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/en')
    const toggle = page.getByRole('button', { name: /Color theme/ })
    await toggle.click() // system -> light
    await toggle.click() // light -> dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.getByRole('link', { name: 'ES, Español' }).first().click()
    await expect(page).toHaveURL(/\/es$/)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
