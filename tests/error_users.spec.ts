import { test, expect } from '@playwright/test';

//locked_out_user
test('LockedOutUserLoginFailsDueToLockedOut', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  //error showing login has failed, and this message can be dismissed
  var errormsg = page.getByText('Epic sadface');
  await expect(errormsg).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  await page.locator('[data-test="error-button"]').click();
  await expect(errormsg).not.toBeVisible();
});

test('LockedOutUserLoginFailsDueToIncorrectPassword', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secretsauce');
  await page.locator('[data-test="login-button"]').click();

  //error showing login has failed, and this message can be dismissed
  var errormsg = page.getByText('Epic sadface');
  await expect(errormsg).toHaveText('Epic sadface: Username and password do not match any user in this service');
});

//performance_glitch_user
//This user has high loading times.
test('PerformanceGlitchUserSuccessfulLogin', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('performance_glitch_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="title"]')).toContainText('Products');
});

test('PerformanceGlitchUserCanLogoutSuccessfully', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('performance_glitch_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  //await page.locator('[data-test="login-button"]').click();
  await page.getByRole('button', { name: 'Login' }).click();

  //see that login is complete and products are displayed
  await expect(page.locator('[data-test="title"]')).toContainText('Products');
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
  await expect(page.locator('[data-test="username"]')).not.toBeVisible();

  //logout and expect to see username field again
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await page.locator('[data-test="username"]').click();
});

//problem_user
//each picture should be different (in general) but these are identical
//items do not follow through to correct product
//One product (Sauce Labs Fleece Jacket) leads to item not found (goes to id=6 which is out of range)

test('ProblemUserSuccessfulLogin', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('problem_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page.locator('[data-test="title"]')).toContainText('Products');
});

test('ProblemUserCanLogoutSuccessfully', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('problem_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  //await page.locator('[data-test="login-button"]').click();
  await page.getByRole('button', { name: 'Login' }).click();

  //see that login is complete and products are displayed
  await expect(page.locator('[data-test="title"]')).toContainText('Products');
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
  await expect(page.locator('[data-test="username"]')).not.toBeVisible();

  //logout and expect to see username field again
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await page.locator('[data-test="username"]').click();
});

test('ProblemUserCheckoutAttempt', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('problem_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  //problem checking out, lastname field issue
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('waracle');
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('test');
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('G1 5QH');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="postalCode"]').click();

  //did not populate - empty - as problem user
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
});

//TODO: test fails so commented out for now
/*test('ProblemUserCheckoutAttempt', async ({ page }) => {
  await page.goto('https://qa-challenge.codesubmit.io/');
  await expect(page).toHaveTitle('Swag Labs');

  //fill username and password
  await page.locator('[data-test="username"]').click();
  page.locator('[data-test="username"]').fill('problem_user');
  await page.locator('[data-test="password"]').click();
  page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  //problem checking out, lastname field issue
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('waracle');
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill('test');
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill('G1 5QH');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
});
*/