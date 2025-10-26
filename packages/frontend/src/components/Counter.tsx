'use client'

import { useState } from 'react'

// 定数定義
const INITIAL_COUNT = 0
const INCREMENT_AMOUNT = 1
const DECREMENT_AMOUNT = 1

/**
 * カウンターコンポーネント
 * ボタンクリックで数値の増減とリセットが可能
 */
export default function Counter() {
  // カウント値の状態管理（初期値は0）
  const [count, setCount] = useState<number>(INITIAL_COUNT)

  /**
   * +1ボタンのクリックハンドラー
   * 関数型更新を使用して、最新の状態に基づいて更新
   */
  const handleIncrement = () => {
    setCount((prevCount) => prevCount + INCREMENT_AMOUNT)
  }

  /**
   * -1ボタンのクリックハンドラー
   * 関数型更新を使用して、最新の状態に基づいて更新
   */
  const handleDecrement = () => {
    setCount((prevCount) => prevCount - DECREMENT_AMOUNT)
  }

  /**
   * リセットボタンのクリックハンドラー
   * カウントを初期値（0）に戻す
   */
  const handleReset = () => {
    setCount(INITIAL_COUNT)
  }

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleDecrement}>-1</button>
      <button onClick={handleReset}>リセット</button>
    </div>
  )
}
