import { test, expect } from '@playwright/test';

test("index page title", async ({ page }) => {
    await page.goto('/');
    expect(page.getByText("MY TODO APP")).toBeDefined();
})

test("form on index page creates new todos", async ({ page }) => {
    await page.goto('/');

    await page.getByLabel("Nazev Todo").fill("E2E todo")
    await page.getByRole('button', { name: 'Přidat todo' }).click();
    await expect(page.getByText("E2E todo")).toBeDefined()
})