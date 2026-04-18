import { test, expect } from '@playwright/test';

test.describe('Admin System Reports', () => {
  test('should filter reports and download CSV successfully', async ({ page }) => {
    await page.goto('/admin/reports');
    
    // Check if we are on the reports page
    await expect(page.locator('h1')).toContainText('System Reports');
    
    // Fill the filters
    // 1. Select a club (if any available)
    const clubSelect = page.locator('select').first();
    const hasClubs = await clubSelect.locator('option').count() > 1;
    if (hasClubs) {
      await clubSelect.selectOption({ index: 1 });
    }
    
    // 2. Set dates
    await page.fill('input[type="date"]', '2024-01-01'); // Start Date
    await page.locator('input[type="date"]').nth(1).fill('2026-12-31'); // End Date
    
    // Click Generate
    await page.click('button:has-text("Generate")');
    
    // Check for "Filtering applied" badge (if implemented as in the code I saw)
    await expect(page.locator('text=Filtering applied')).toBeVisible();
    
    // Take a screenshot of the filtered report
    await page.screenshot({ path: 'test-results/screenshots/reports-filtered.png' });
    
    // Download CSV
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Export Events CSV")')
    ]);
    
    // Save the download
    const path = `test-results/downloads/${download.suggestedFilename()}`;
    await download.saveAs(path);
    
    // Verification of download
    expect(download.suggestedFilename()).toContain('.csv');
    
    // Take screenshot after download
    await page.screenshot({ path: 'test-results/screenshots/reports-csv-downloaded.png' });
  });
});
