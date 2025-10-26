import { test, expect } from '@playwright/test';

/**
 * Counterコンポーネントのエンドツーエンドテスト
 * ユーザー視点での動作確認を実施
 */
test.describe('Counterコンポーネント', () => {
  // 各テストの前にホームページにアクセス
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('初期表示で「Count: 0」が表示される', async ({ page }) => {
    // カウント値が0であることを確認
    await expect(page.getByText('Count: 0')).toBeVisible();
  });

  test('+1ボタンをクリックするとカウントが1増える', async ({ page }) => {
    // +1ボタンをクリック
    await page.getByRole('button', { name: '+1' }).click();

    // カウント値が1になることを確認
    await expect(page.getByText('Count: 1')).toBeVisible();
  });

  test('-1ボタンをクリックするとカウントが1減る', async ({ page }) => {
    // まず+1を2回クリックして2にする
    const plusButton = page.getByRole('button', { name: '+1' });
    await plusButton.click();
    await plusButton.click();
    await expect(page.getByText('Count: 2')).toBeVisible();

    // -1ボタンをクリック
    await page.getByRole('button', { name: '-1' }).click();

    // カウント値が1になることを確認
    await expect(page.getByText('Count: 1')).toBeVisible();
  });

  test('リセットボタンをクリックするとカウントが0になる', async ({ page }) => {
    // +1を3回クリックして3にする
    const plusButton = page.getByRole('button', { name: '+1' });
    await plusButton.click();
    await plusButton.click();
    await plusButton.click();
    await expect(page.getByText('Count: 3')).toBeVisible();

    // リセットボタンをクリック
    await page.getByRole('button', { name: 'リセット' }).click();

    // カウント値が0に戻ることを確認
    await expect(page.getByText('Count: 0')).toBeVisible();
  });

  test('連続してボタンをクリックしても正しく動作する', async ({ page }) => {
    const plusButton = page.getByRole('button', { name: '+1' });
    const minusButton = page.getByRole('button', { name: '-1' });

    // +1を5回クリック
    for (let i = 0; i < 5; i++) {
      await plusButton.click();
    }
    await expect(page.getByText('Count: 5')).toBeVisible();

    // -1を2回クリック
    await minusButton.click();
    await minusButton.click();
    await expect(page.getByText('Count: 3')).toBeVisible();

    // +1を1回クリック
    await plusButton.click();
    await expect(page.getByText('Count: 4')).toBeVisible();
  });

  test('負の数でも正しく表示される', async ({ page }) => {
    // -1を3回クリックして-3にする
    const minusButton = page.getByRole('button', { name: '-1' });
    await minusButton.click();
    await minusButton.click();
    await minusButton.click();

    // カウント値が-3になることを確認
    await expect(page.getByText('Count: -3')).toBeVisible();
  });

  test('リセット後に再度カウントを変更できる', async ({ page }) => {
    const plusButton = page.getByRole('button', { name: '+1' });
    const resetButton = page.getByRole('button', { name: 'リセット' });

    // +1を2回クリック
    await plusButton.click();
    await plusButton.click();
    await expect(page.getByText('Count: 2')).toBeVisible();

    // リセット
    await resetButton.click();
    await expect(page.getByText('Count: 0')).toBeVisible();

    // 再度+1をクリック
    await plusButton.click();
    await expect(page.getByText('Count: 1')).toBeVisible();
  });
});
