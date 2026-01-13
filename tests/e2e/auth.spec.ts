import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should show login page', async ({ page }) => {
        await page.goto('/login');
        // Check for role input or heading
        await expect(page).toHaveTitle(/Campus Facility Management System/i);
        await expect(page.locator('input[name="role"]')).toBeVisible();
    });

    test('should fail login with invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="role"]', 'WRONG_ROLE');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Check for error message
        await expect(page.locator('text=Role atau password salah')).toBeVisible();
    });
});
