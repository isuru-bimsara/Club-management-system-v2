import { test, expect } from '@playwright/test';

test.describe('Admin Club Management', () => {
  test('should create a new club successfully', async ({ page }) => {
    await page.goto('/admin/clubs');
    await expect(page).toHaveURL(/.*\/admin\/clubs/);
    
    // Check if we are on the clubs page
    await expect(page.locator('h1:has-text("Manage Clubs")')).toBeVisible();
    
    // Click on "Add New Club" button
    await page.click('button:has-text("Add New Club")');
    await expect(page).toHaveURL(/.*\/admin\/clubs\/add/);
    
    // Fill the form with a unique name
    const randomSuffix = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
    const clubName = `PlaywrightClub${randomSuffix}`;
    await page.fill('input#clubName', clubName);
    await page.fill('textarea#description', 'This is a test club description for Playwright testing.');
    
    // Select a president - try to find one that works or just pick one
    // We'll try the first few options
    const optionsCount = await page.locator('select#presidentId option').count();
    if (optionsCount <= 1) {
      throw new Error('No students available in the dropdown');
    }

    // Try selecting the last one in the list (less likely to be taken)
    await page.selectOption('select#presidentId', { index: optionsCount - 1 });
    
    // Click Create Club and wait for navigation
    await page.click('button[type="submit"]:has-text("Create Club")');
    
    // Wait for success toast to potentially appear and then redirect
    await expect(page).toHaveURL(/.*\/admin\/clubs/, { timeout: 15000 });
    
    // Verify the new club exists in the list
    await expect(page.locator(`text=${clubName}`).first()).toBeVisible();
    
    // Take a screenshot for documentation
    await page.screenshot({ path: 'test-results/screenshots/create-club-success.png' });
  });
});
