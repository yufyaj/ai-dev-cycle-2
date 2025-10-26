import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2Eテスト設定
 * Next.js開発サーバーと連携してE2Eテストを実行
 */
export default defineConfig({
  // テストディレクトリ
  testDir: './e2e',

  // 各テストのタイムアウト（30秒）
  timeout: 30 * 1000,

  // 並列実行の設定
  fullyParallel: true,

  // CI環境では失敗時にリトライしない
  forbidOnly: !!process.env.CI,

  // ローカルでは1回、CIでは2回リトライ
  retries: process.env.CI ? 2 : 0,

  // 並列ワーカー数（CI環境では1、ローカルでは未定義）
  workers: process.env.CI ? 1 : undefined,

  // レポーター設定
  reporter: [
    ['html'],
    ['list'],
  ],

  // すべてのテストで共通の設定
  use: {
    // ベースURL（Next.js開発サーバー）
    baseURL: 'http://localhost:3000',

    // スクリーンショット: 失敗時のみ
    screenshot: 'only-on-failure',

    // ビデオ: 最初の失敗時のみ
    video: 'retain-on-failure',

    // トレース: 最初の失敗時のみ
    trace: 'on-first-retry',
  },

  // テスト対象ブラウザの設定
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // モバイルブラウザ（必要に応じてコメント解除）
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Next.js開発サーバーの自動起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // サーバー起動のタイムアウト（2分）
  },
});
