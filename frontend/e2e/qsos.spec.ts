import { test } from '@playwright/test';
import { dashboard_page } from './pages/dashboard';

test.describe.parallel('QSOS', () => {
  test('Dashboard Page', async ({ page }) => {
    await dashboard_page(page);
  });

});
