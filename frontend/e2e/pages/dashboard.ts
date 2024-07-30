import { expect } from '@playwright/test';
import { baseURL } from '../utils';
import { Page } from 'playwright';

export const dashboard_page = async (page: Page) => {
  await page.goto(baseURL);
  await expect(page.getByRole('link', { name: 'Government of British Columbia' })).toBeVisible();
  await expect(page.getByText('QuickStart OpenShift')).toBeVisible()
  await expect(page.getByText('Employee ID')).toBeVisible();
  await expect(page.getByText('Employee Name')).toBeVisible();
  await expect(page.getByText('Employee Email')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About gov.bc.ca' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Disclaimer' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Accessibility' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Copyright' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact us' })).toBeVisible();
  await page.getByPlaceholder('Search…').click();
  await page.getByPlaceholder('Search…').fill('john');
  await expect(page.locator('#root')).toContainText('1–1 of 1');
};
