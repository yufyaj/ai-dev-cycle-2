'use client'

import { useState, useCallback } from 'react'

/**
 * カウンターコンポーネント
 * ボタンクリックで数値を増減できるシンプルなカウンター
 *
 * @remarks
 * - 初期値は0
 * - 負の数にも対応
 * - リセット後に再度カウント可能
 *
 * @example
 * ```tsx
 * <Counter />
 * ```
 */
export default function Counter() {
  const [count, setCount] = useState<number>(0)

  /**
   * カウント値を1増やす
   * 最大値の制限なし
   */
  const handleIncrement = useCallback(() => {
    setCount((prevCount) => prevCount + 1)
  }, [])

  /**
   * カウント値を1減らす
   * 最小値の制限なし（負の数に対応）
   */
  const handleDecrement = useCallback(() => {
    setCount((prevCount) => prevCount - 1)
  }, [])

  /**
   * カウント値を0にリセット
   */
  const handleReset = useCallback(() => {
    setCount(0)
  }, [])

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleDecrement}>-1</button>
      <button onClick={handleReset}>リセット</button>
    </div>
  )
}
