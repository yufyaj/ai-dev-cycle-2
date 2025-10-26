'use client'

import { useState } from 'react'

/**
 * カウンターコンポーネント
 * ボタンクリックで数値を増減させるシンプルなコンポーネント
 *
 * @returns カウンター表示とボタンを含むReactコンポーネント
 */
export default function Counter() {
  // カウントの状態管理（初期値は0）
  const [count, setCount] = useState(0)

  /**
   * カウントを1増やす
   * useCallbackは不要（シンプルなコンポーネントのため）
   */
  const increment = () => {
    setCount((prevCount) => prevCount + 1)
  }

  /**
   * カウントを1減らす
   */
  const decrement = () => {
    setCount((prevCount) => prevCount - 1)
  }

  /**
   * カウントを0にリセット
   */
  const reset = () => {
    setCount(0)
  }

  return (
    <div style={styles.container}>
      <div style={styles.display} aria-live="polite" aria-atomic="true">
        Count: {count}
      </div>
      <div style={styles.buttonGroup}>
        <button
          onClick={increment}
          style={styles.button}
          aria-label="カウントを1増やす"
        >
          +1
        </button>
        <button
          onClick={decrement}
          style={styles.button}
          aria-label="カウントを1減らす"
        >
          -1
        </button>
        <button
          onClick={reset}
          style={styles.resetButton}
          aria-label="カウントをリセット"
        >
          リセット
        </button>
      </div>
    </div>
  )
}

/**
 * コンポーネントのスタイル定義
 * シンプルで視認性の高いデザイン
 */
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
    padding: '24px',
  },
  display: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resetButton: {
    padding: '8px 16px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}
