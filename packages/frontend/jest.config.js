const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // next.config.jsとテスト環境の.envファイルが配置されているディレクトリを指定
  dir: './',
})

// Jestのカスタム設定
const customJestConfig = {
  // テスト実行前にセットアップファイルを実行
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // テスト環境をjsdomに設定（ブラウザ環境をシミュレート）
  testEnvironment: 'jest-environment-jsdom',
  // モジュールパスのエイリアス設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // カバレッジ対象ファイルの設定
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/app/**', // Next.jsのappディレクトリは除外（別途E2Eテストでカバー）
  ],
  // テストファイルのパターン
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  // カバレッジの閾値
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// next/jestの設定とカスタム設定をマージ
module.exports = createJestConfig(customJestConfig)
