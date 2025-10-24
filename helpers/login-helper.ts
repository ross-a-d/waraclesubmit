import { test, expect, Page, Locator } from '@playwright/test';

export class LoginHelper {
    readonly page: Page;
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly incorrectCredentialsMessage: Locator;
    
    
    constructor(page: Page){
        this.page = page;
         this.usernameInput = page.locator('[data-test="username"]')
         this.passwordInput = page.locator('[data-test="password"]')
         this.loginButton = page.locator('[data-test="login-button"]')
         this.incorrectCredentialsMessage = page.locator('[data-test="error"]')
    }

    async login(username: string, password: string){
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
}