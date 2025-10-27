// CSS Modulesの型定義
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Jest DOMのカスタムマッチャー型定義
/// <reference types="@testing-library/jest-dom" />
