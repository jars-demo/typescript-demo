import { expect, test } from '@playwright/test'

test('the hero toy fixes a type error and starts the workshop', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('catch bugs')

  await page.getByRole('button', { name: 'Fix it' }).click()
  await expect(page.getByText('✓ 0 errors')).toBeVisible()
  await expect(page.getByRole('img', { name: /happy/ })).toBeVisible()

  await page.getByRole('link', { name: 'Start the workshop' }).click()
  await expect(page).toHaveURL(/\/workshop\/01-why-typescript$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Why TypeScript')
})

test('the workshop lists every chapter and pages through them', async ({ page }) => {
  await page.goto('/workshop')
  const chapters = page.locator('main ol > li')
  await expect(chapters).toHaveCount(10)

  await chapters.nth(4).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Unions and narrowing')
  await expect(page.getByRole('button', { name: 'Copy' }).first()).toBeVisible()

  await page.getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(/06-functions-and-generics$/)
})

test('nothing scrolls sideways', async ({ page }) => {
  for (const path of ['/', '/workshop', '/workshop/07-outside-data']) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test('back to top appears after scrolling and returns to the top', async ({ page }) => {
  await page.goto('/workshop/07-outside-data')
  const button = page.getByRole('button', { name: 'Back to top' })
  await expect(button).toBeHidden()

  await page.evaluate(() => window.scrollTo(0, 3000))
  await expect(button).toBeVisible()
  await button.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
