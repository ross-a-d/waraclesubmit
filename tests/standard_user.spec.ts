import { test, expect } from '@playwright/test';

test('standardUserCanLoginSuccessfully', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  //see that login is complete and products are displayed
  await expect(page.locator('[data-test="title"]')).toContainText('Products');
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
});

test('standardUserIncorrectPasswordFails', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and incorrect password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secretsauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  //error showing login has failed, and this message can be dismissed
  var errormsg = page.getByText('Epic sadface');
  await expect(errormsg).toHaveText('Epic sadface: Username and password do not match any user in this service');
  await page.locator('[data-test="error-button"]').click();
  await expect(errormsg).not.toBeVisible();
});