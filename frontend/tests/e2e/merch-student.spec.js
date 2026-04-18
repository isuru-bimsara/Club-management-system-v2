import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { login } from '../fixtures/auth';
import { getRunScreenshotDir, shot } from '../fixtures/screenshots';

test('Student can place merchandise order (size + receipt upload)', async ({ page }, testInfo) => {
  const shotDir = getRunScreenshotDir(testInfo);

  await login(
    page,
    process.env.E2E_STUDENT_EMAIL,
    process.env.E2E_STUDENT_PASSWORD
  );
  await shot(page, shotDir, '01-after-login');

  const eventId = process.env.E2E_EVENT_ID;
  if (!eventId) throw new Error('E2E_EVENT_ID is missing in .env.e2e');

  await page.goto(`/events/${eventId}`);
  await expect(page).toHaveURL(new RegExp(`/events/${eventId}`));
  await expect(page.getByText(/merchandise/i)).toBeVisible({ timeout: 15000 });
  await shot(page, shotDir, '02-event-page-open');

  const buyButton = page.getByRole('button', { name: /^buy$/i }).first();
  await expect(buyButton).toBeVisible({ timeout: 15000 });
  await buyButton.click();

  await expect(page.getByRole('heading', { name: /buy merchandise/i })).toBeVisible();
  await shot(page, shotDir, '03-buy-modal-open');

  // If size dropdown exists, select first available option
  const sizeSelect = page.locator('select.input, select').first();
  if (await sizeSelect.count()) {
    const options = sizeSelect.locator('option');
    const optionCount = await options.count();
    if (optionCount > 0) {
      // choose first non-disabled option
      let selected = false;
      for (let i = 0; i < optionCount; i++) {
        const disabled = await options.nth(i).isDisabled();
        const value = await options.nth(i).getAttribute('value');
        if (!disabled && value) {
          await sizeSelect.selectOption(value);
          selected = true;
          break;
        }
      }
      if (selected) await shot(page, shotDir, '04-size-selected');
    }
  }

  // Quantity
  const qtyInput = page.locator('input[type="number"]').first();
  await qtyInput.fill('1');

  // Receipt upload
  const receiptPath = path.resolve('tests/fixtures/receipt.png');
  if (!fs.existsSync(receiptPath)) {
    throw new Error(`Receipt file not found at: ${receiptPath}`);
  }

  await page.locator('input[type="file"]').setInputFiles(receiptPath);
  await shot(page, shotDir, '05-receipt-uploaded');

  // Submit
  await page.getByRole('button', { name: /^submit$/i }).click();

  await expect(page.getByText(/order submitted|await approval/i)).toBeVisible({
    timeout: 15000,
  });
  await shot(page, shotDir, '06-order-submitted');
});