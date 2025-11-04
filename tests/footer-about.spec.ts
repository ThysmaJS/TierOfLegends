import { test, expect } from '@playwright/test';

// Success: clicking the footer link navigates to the About page
test('footer link "À propos" navigates to the About page', async ({ page }) => {
  await page.goto('/');
  const aboutLink = page.getByRole('link', { name: 'À propos' });
  await expect(aboutLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/a-propos$/, { timeout: 10000 }),
    aboutLink.click()
  ]);
  await expect(page.getByRole('heading', { level: 1, name: /À propos/i })).toBeVisible();
});
