import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { getRunScreenshotDir, shot } from '../fixtures/screenshots';

test('President can open merchandise inbox', async ({ page }, testInfo) => {
  const shotDir = getRunScreenshotDir(testInfo);

  await login(
    page,
    process.env.E2E_PRESIDENT_EMAIL,
    process.env.E2E_PRESIDENT_PASSWORD
  );
  await shot(page, shotDir, '01-after-login');

  await page.goto('/president/merch');
  await expect(page).toHaveURL(/\/president\/merch/);
  await expect(page.locator('body')).toContainText(/merch|order|inbox|approvals/i);

  await shot(page, shotDir, '02-inbox-opened');
});