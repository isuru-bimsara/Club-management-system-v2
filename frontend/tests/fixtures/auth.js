import { expect } from '@playwright/test';

export async function login(page, email, password) {
  if (!email || !password) {
    throw new Error(
      `Missing credentials. email=${email ?? 'undefined'}, password=${password ? '***' : 'undefined'}`
    );
  }

  await page.goto('/login');

  // Your Login component placeholders
  await page.getByPlaceholder(/email address/i).fill(email.trim());
  await page.getByPlaceholder(/^password$/i).fill(password);

  await page.getByRole('button', { name: /^login$/i }).click();

  // Wait until we leave login page
  await expect(page).not.toHaveURL(/\/login$/, { timeout: 15000 });
}