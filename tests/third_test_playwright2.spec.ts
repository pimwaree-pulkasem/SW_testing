import { test, expect } from '@playwright/test';

test('login-failure and error handling', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('123456789');
  await page.locator('[data-test="login-button"]').click();

  const errorMsg = page.locator('[data-test="error"]');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText('do not match');
  await expect(page.locator('[data-test="username"]')).toHaveClass(/.*error.*/);

  await page.locator('[data-test="error-button"]').click();
  await expect(errorMsg).not.toBeVisible();

  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  const firstItemPrice = page.locator('.inventory_item_price').first();
  await expect(firstItemPrice).toHaveText('$7.99');
});
