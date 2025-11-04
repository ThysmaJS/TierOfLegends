import { test, expect } from '@playwright/test';

// Failure: creating a tier list with missing required fields should show errors
// This test assumes anonymous user; app should redirect to login on save. We still verify client-side validations first.

test('new tier list page validates inputs before save', async ({ page }) => {
  await page.goto('/tier-lists/new');

  // If redirected to login, skip client-side validation test
  if (/\/login/.test(page.url())) {
    test.skip(true, 'Auth enforced; skipping client-side validation test');
  }

  // Clear title to trigger validation
  const titleInput = page.getByPlaceholder('Titre de la tier list');
  await expect(titleInput).toBeVisible();
  await titleInput.fill('');

  const saveBtn = page.getByRole('button', { name: 'Sauvegarder' });
  await saveBtn.click();

  // Expect title error
  await expect(page.getByText('Le titre est requis')).toBeVisible();

  // If category is champion-skins (default), and no champion selected, expect field error after another save
  await saveBtn.click();
  await expect(page.getByText('Choisis un champion pour cette catégorie')).toBeVisible();
});
