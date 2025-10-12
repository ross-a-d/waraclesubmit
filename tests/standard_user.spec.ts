import { test, expect } from '@playwright/test';
import { LoginHelper } from '../helpers/login-helper'

let loginHelper: LoginHelper

test.beforeEach(async ({ page }) => {
  loginHelper = new LoginHelper(page)
  await page.goto('https://qa-challenge.codesubmit.io/')
});

test('cannotAccessPagesIfNotLoggedIn', { tag: ['@standarduser'] }, async ({ page }) => {
  var listOfPages = ["inventory", "cart", "checkout-step-one", "checkout-step-two", "checkout-complete"];

  for (let i = 0; i < listOfPages.length; i++) {
    await page.goto('https://qa-challenge.codesubmit.io/' + listOfPages[i].toString() + '.html');
    //await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: You can only access \'/inventory.html\' when you are logged in.');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: You can only access \'/' + listOfPages[i].toString() + '.html\' when you are logged in.');
  }
});

test('standardUserCanLoginSuccessfully', async ({ page }) => {
  //login as std user
  await loginHelper.login('standard_user', 'secret_sauce')

  //see that login is complete and products are displayed
  await expect(page.locator('[data-test="title"]')).toContainText('Products');
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
  await expect(page.locator('[data-test="username"]')).not.toBeVisible();
});

test('standardUserCanLogoutSuccessfully', async ({ page }) => {
  //login as std user
  await loginHelper.login('standard_user', 'secret_sauce')

  //see that login is complete and products are displayed
  await expect(page.locator('[data-test="title"]')).toContainText('Products');
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
  await expect(page.locator('[data-test="username"]')).not.toBeVisible();

  //logout and expect to see username field again
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await page.locator('[data-test="username"]').click();
});

test('standardUserCanFilterProducts', async ({ page }) => {
  //login as std user
  await loginHelper.login('standard_user', 'secret_sauce')

  //see that login is complete and products are displayed
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();

  //Filters
  await expect(page.locator('[data-test="active-option"]')).toContainText('Name (A to Z)');
  await expect(page.getByText('Name (Z to A)')).not.toBeVisible();
  //check product order


  await page.locator('[data-test="product-sort-container"]').selectOption('za')
  await expect(page.locator('[data-test="active-option"]')).toContainText('Name (Z to A)');

  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
  await expect(page.locator('[data-test="active-option"]')).toContainText('Price (low to high)')

  await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
  await expect(page.locator('[data-test="active-option"]')).toContainText('Price (high to low)')
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

//BELOW TWO NOT MENTIONED IN README BUT WERE ON WEBSITE AS 'Accepted Usernames' SO INCLUDED HERE

test('ErrorUserLogin', async ({ page }) => {
  //login as error user
  await loginHelper.login('error_user', 'secret_sauce')

  //login succeeds
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
});

//this user has randomly generated prices on the inventory page, things out of alignment/general oddness,
// and prices to different decimal places/significant figures etc.

test('VisualUserLogin', async ({ page }) => {
  await loginHelper.login('visual_user', 'secret_sauce')

  //login succeeds
  await expect(page.locator('[data-test="inventory-list"]')).not.toBeEmpty();
});



//filter a-z etc.
//remove from basket
//checkout success
//can checkout with no products - fail
