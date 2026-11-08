import { expect, test, type Page } from '@playwright/test'

const watchErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(e.message))
  return errors
}

const ROUTES = ['/', '/handbook', '/handbook/tailoring-fit', '/encyclopedia', '/encyclopedia/blazer', '/compare?a=blazer&b=sport-coat',
  '/studio', '/studio?preset=winter-dinner', '/atlas', '/atlas/ivy', '/practice', '/practice/colour-workshop', '/saved', '/search?q=tweed', '/nowhere']

for (const route of ROUTES) {
  test(`renders ${route} without console errors`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(route)
    await expect(page.locator('h1').first()).toBeVisible()
    await page.waitForLoadState('networkidle')
    expect(errors).toEqual([])
  })
}

test('studio: dress the figure, save, and reopen from Saved', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/studio')
  await page.getByRole('button', { name: /^Jacket/ }).click()
  await page.getByRole('radio', { name: 'Navy blazer' }).click()
  await expect(page).toHaveURL(/jacket\.blazer/)
  await expect(page.locator('svg [data-slot="jacket"]').first()).toBeAttached()

  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await page.getByLabel('Outfit name').fill('E2E blazer look')
  await page.getByLabel('Outfit name').press('Enter')
  await expect(page.getByText(/Saved “E2E blazer look”/)).toBeVisible()

  await page.goto('/saved')
  await page.getByRole('link', { name: /E2E blazer look/ }).first().click()
  await expect(page).toHaveURL(/\/studio\?o=.*jacket\.blazer/)
  expect(errors).toEqual([])
})

test('search finds a garment and opens it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Search/ }).first().click()
  await page.getByRole('combobox', { name: 'Search' }).fill('loafer')
  await page.getByRole('option').filter({ hasText: 'Loafer' }).first().click()
  await expect(page).toHaveURL(/\/encyclopedia\/loafer/)
  await expect(page.getByRole('heading', { level: 1, name: 'Loafer' })).toBeVisible()
})

test('theme choice persists across reloads', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Edition (colour theme)' }).click()
  await page.getByText('The Midnight Edition').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'midnight')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'midnight')
})

test('deep link to a chapter shows breadcrumbs back to the handbook', async ({ page }) => {
  await page.goto('/handbook/tailoring-fit')
  await page.getByRole('navigation', { name: /breadcrumb/i }).getByRole('link', { name: /handbook/i }).click()
  await expect(page).toHaveURL(/\/handbook$/)
})
