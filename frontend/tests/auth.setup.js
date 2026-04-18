import { test as setup, expect } from '@playwright/test';

const adminFile = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  // Go to admin login page
  await page.goto('/admin-login');
  
  // Fill in credentials
  await page.fill('input[name="email"]', 'admin@sliit.lk');
  await page.fill('input[name="password"]', 'Admin@123');
  
  // Click authenticate
  await page.click('button:has-text("Authenticate")');
  
  // Wait for navigation and a unique element on the dashboard
  await expect(page).toHaveURL(/.*\/admin/);
  await expect(page.locator('text=Welcome Back')).toBeVisible();
  
  // Verify localStorage contains the token
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    throw new Error('Auth token not found in localStorage after login');
  }
  
  // End of authentication
  await page.context().storageState({ path: adminFile });
});
