import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Tier/i);
});

test('tier lists filter and open detail', async ({ page }) => {
  await page.goto('/tier-lists');

  // Filter by typing in the search input
  const searchInput = page.getByPlaceholder('Rechercher…');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('A'); // generic input to trigger filter logic

  // Click the first card link to a detail page (exclude the "/tier-lists/new" link)
  const cardLinks = page.locator('a[href^="/tier-lists/"]:not([href$="/new"])');
  const count = await cardLinks.count();
  test.skip(count === 0, 'No tier lists available to open');

  await Promise.all([
    page.waitForURL(/\/tier-lists\//, { timeout: 10000 }),
    cardLinks.first().click()
  ]);

  // Basic smoke assertion: page has heading or content
  await expect(page.locator('h1, h2, [data-testid="tierlist-title"]').first()).toBeVisible();
});
