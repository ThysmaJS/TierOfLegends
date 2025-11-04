import { test, expect } from '@playwright/test';

// Failure: visiting a non-existent page should show the 404 UI
test('unknown route shows 404 page', async ({ page }) => {
  await page.goto('/does-not-exist-xyz');
  await expect(page.getByText('Erreur 404')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Oups, page introuvable/i })).toBeVisible();
  const homeLink = page.getByRole('link', { name: /Revenir à l'accueil/i });
  await expect(homeLink).toBeVisible();
});
