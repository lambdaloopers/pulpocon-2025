import { test, expect } from '@playwright/test'

test('homepage contains main hero card and CTA', async ({ page }) => {
  await page.goto('/')

  const welcomeMessage = page.getByText(/^\s*¡Bienvenido a TentaCool!\s*$/);
  await expect(welcomeMessage).toHaveCount(1);
  await expect(welcomeMessage).toBeVisible()
  
  const loc = page.getByText(/^\s*Descubre un mundo de posibilidades donde la tecnología se encuentra con la creatividad\s*$/);
  await expect(loc).toHaveCount(1);
  await expect(loc).toBeVisible();
  
  const showUserButton = page.getByRole('button', { name: /^\s*Iniciar sesión con Google\s*$/i });
  await expect(showUserButton).toBeVisible()

})


