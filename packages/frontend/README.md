# Frontend

Next.js + TypeScript フロントエンドアプリケーション

## 技術スタック

- Next.js 14
- TypeScript
- React 18
- Jest（単体テスト）
- React Testing Library
- Playwright（E2Eテスト）

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

## テスト

### 単体テスト

```bash
# テスト実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# ウォッチモード
npm run test:watch
```

### E2Eテスト

```bash
# E2Eテスト実行
npm run test:e2e

# UIモードで実行（デバッグに便利）
npm run test:e2e:ui

# デバッグモード
npm run test:e2e:debug
```
