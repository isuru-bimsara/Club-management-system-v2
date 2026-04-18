import { test, expect } from '@playwright/test';
import { login } from '../fixtures/auth';
import { getRunScreenshotDir, shot } from '../fixtures/screenshots';

test('President can create, edit, and delete merchandise', async ({ page }, testInfo) => {
  const shotDir = getRunScreenshotDir(testInfo);

  await login(
    page,
    process.env.E2E_PRESIDENT_EMAIL,
    process.env.E2E_PRESIDENT_PASSWORD
  );
  await shot(page, shotDir, '01-after-login');

  await page.goto('/president/merch/add');
  await expect(page.getByRole('heading', { name: /merchandise/i })).toBeVisible({ timeout: 20000 });
  await shot(page, shotDir, '02-merch-page-open');

  const itemName = `PW Item ${Date.now()}`;

  // select event
  await page.locator('form select').first().selectOption({ index: 1 });

  // basic fields
  await page.getByPlaceholder(/official club jersey|club t-shirt|item name|e\.g\./i).first().fill(itemName);
  await page.getByPlaceholder(/detailed location for pickup|pickup venue/i).first().fill('Main Hall');
  await page.locator('input[inputmode="numeric"]').first().fill('2500'); // price

  // if size mode exists, keep unchecked; fill stock qty
  const sizeCheckbox = page.getByLabel(/this product has sizes/i);
  if (await sizeCheckbox.count()) {
    const checked = await sizeCheckbox.isChecked();
    if (checked) await sizeCheckbox.uncheck();
  }

  await page.locator('input[inputmode="numeric"]').nth(1).fill('20'); // stock qty

  // bank details
  await page.getByPlaceholder(/bank name/i).first().fill('BOC');
  await page.getByPlaceholder(/account name/i).first().fill('SLIIT Club');
  await page.getByPlaceholder(/account number/i).first().fill('1234567890');
  const branch = page.getByPlaceholder(/branch/i).first();
  if (await branch.count()) await branch.fill('Malabe');

  await shot(page, shotDir, '03-form-filled');

  // create
  await page.getByRole('button', { name: /create item|create merchandise|create/i }).first().click();
  await expect(page.getByText(/merchandise created|created/i)).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(itemName)).toBeVisible({ timeout: 15000 });
  await shot(page, shotDir, '04-item-created');

  // edit
  const card = page.locator('.card').filter({ hasText: itemName }).first();
  await card.getByRole('button', { name: /edit/i }).click();
  await page.locator('input[inputmode="numeric"]').first().fill('3000');
  await page.getByRole('button', { name: /save changes|update/i }).first().click();
  await expect(page.getByText(/updated|merchandise updated/i)).toBeVisible({ timeout: 15000 });
  await shot(page, shotDir, '05-item-updated');

  // delete
  const updatedCard = page.locator('.card').filter({ hasText: itemName }).first();
  page.once('dialog', d => d.accept());
  await updatedCard.getByRole('button', { name: /delete/i }).click();
  await expect(page.getByText(/deleted/i)).toBeVisible({ timeout: 15000 });
  await shot(page, shotDir, '06-item-deleted');
});