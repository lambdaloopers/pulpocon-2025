import { test, expect } from '@playwright/test'

test('homepage contains main hero card and CTA', async ({ page }) => {
  await page.goto('/')

  const welcomeMessage = page.getByText(/^\s*Bienvenido a Pulpocon 2025\s*$/);
  await expect(welcomeMessage).toHaveCount(1);
  await expect(welcomeMessage).toBeVisible()
  
  const loc = page.getByText(/^\s*Una aplicación web moderna construida con Next\.js, TypeScript, shadcn\/ui, y Prisma\s*$/);
  await expect(loc).toHaveCount(1);
  await expect(loc).toBeVisible();
  
  const showUserButton = page.getByRole('button', { name: /^\s*Ver Usuarios\s*$/i });
  await expect(showUserButton).toBeVisible()

})


