'use client';

import React, { useState } from 'react';
import styles from './Counter.module.css';

/**
 * カウンターコンポーネント
 * ボタンクリックで数値を増減できるシンプルなカウンター
 */
const Counter: React.FC = () => {
  // カウント値を管理するstate（初期値は0）
  const [count, setCount] = useState<number>(0);

  /**
   * カウントを1増やす
   */
  const handleIncrement = (): void => {
    setCount((prevCount) => prevCount + 1);
  };

  /**
   * カウントを1減らす
   */
  const handleDecrement = (): void => {
    setCount((prevCount) => prevCount - 1);
  };

  /**
   * カウントを0にリセット
   */
  const handleReset = (): void => {
    setCount(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.display}>Count: {count}</div>
      <div className={styles.buttonGroup}>
        <button className={styles.incrementButton} onClick={handleIncrement}>
          +1
        </button>
        <button className={styles.decrementButton} onClick={handleDecrement}>
          -1
        </button>
        <button className={styles.resetButton} onClick={handleReset}>
          リセット
        </button>
      </div>
    </div>
  );
};

export default Counter;
