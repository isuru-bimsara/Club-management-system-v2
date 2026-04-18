import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('h1')).toContainText('Manage Users');
  });

  test('should ban and unban a user successfully', async ({ page }) => {
    // Find a student user (not admin/superadmin)
    // We'll target the first user in the table that has a "Ban" button
    const banButton = page.locator('button:has-text("Ban")').first();
    const userName = await page.locator('tr:has(button:has-text("Ban"))').first().locator('td').first().locator('div.font-medium').textContent();
    
    // Click Ban
    await banButton.click();
    
    // Check for modal
    await expect(page.locator('text=Ban User')).toBeVisible();
    await page.click('button:has-text("Confirm")');
    
    // Check for success toast
    await expect(page.locator('text=User banned successfully')).toBeVisible();
    
    // Take screenshot of banned status
    await page.screenshot({ path: 'test-results/screenshots/user-banned.png' });
    
    // Now unban the same user
    const unbanButton = page.locator('button:has-text("Unban")').first();
    await unbanButton.click();
    await expect(page.locator('text=Unban User')).toBeVisible();
    await page.click('button:has-text("Confirm")');
    
    // Check for success toast
    await expect(page.locator('text=User unbanned successfully')).toBeVisible();
    
    // Take screenshot of unbanned status
    await page.screenshot({ path: 'test-results/screenshots/user-unbanned.png' });
  });

  test('should change user role successfully', async ({ page }) => {
    // Find the first user that is not a superadmin
    const changeRoleButton = page.locator('button:has-text("Change Role")').first();
    const userName = await page.locator('tr:has(button:has-text("Change Role"))').first().locator('td').first().locator('div.font-medium').textContent();
    
    await changeRoleButton.click();
    
    // Check for modal
    await expect(page.locator('text=Change User Role')).toBeVisible();
    
    // Select "President" role
    await page.selectOption('select', 'president');
    await page.click('button:has-text("Update Role")');
    
    // Check for success toast
    await expect(page.locator('text=User role updated to president')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/screenshots/change-role-success.png' });
  });
});
