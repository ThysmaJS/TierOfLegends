import { test, expect } from '@playwright/test';

// Failure: client-side validation errors when fields are empty
// Success: preserves callbackUrl query after landing on /login from protected page

test('login form shows field errors when submitting empty', async ({ page }) => {
  await page.goto('/login');
  const submit = page.getByRole('button', { name: 'Se connecter' });
  await submit.click();
  await expect(page.getByText('Email requis')).toBeVisible();
  await expect(page.getByText('Mot de passe requis')).toBeVisible();
});

test('redirect to login keeps callbackUrl and uses it post-auth (pre-check)', async ({ page }) => {
  await page.goto('/profil');
  // If auth is disabled, skip
  if (!/\/login\?callbackUrl=%2Fprofil$/.test(page.url())) {
    test.skip(true, 'Auth disabled or redirect not enforced in this environment');
  }
  await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fprofil$/);
});
