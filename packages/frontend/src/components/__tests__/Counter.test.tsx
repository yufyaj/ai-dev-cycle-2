import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../Counter';

describe('Counter', () => {
  describe('初期表示', () => {
    it('初期値として0が表示される', () => {
      render(<Counter />);
      expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
    });

    it('+1ボタンが表示される', () => {
      render(<Counter />);
      expect(screen.getByRole('button', { name: /\+1/i })).toBeInTheDocument();
    });

    it('-1ボタンが表示される', () => {
      render(<Counter />);
      expect(screen.getByRole('button', { name: /-1/i })).toBeInTheDocument();
    });

    it('リセットボタンが表示される', () => {
      render(<Counter />);
      expect(screen.getByRole('button', { name: /リセット/i })).toBeInTheDocument();
    });
  });

  describe('カウント増加機能', () => {
    it('+1ボタンをクリックすると値が1増える', () => {
      render(<Counter />);
      const incrementButton = screen.getByRole('button', { name: /\+1/i });

      fireEvent.click(incrementButton);

      expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
    });

    it('+1ボタンを複数回クリックすると値が正しく増える', () => {
      render(<Counter />);
      const incrementButton = screen.getByRole('button', { name: /\+1/i });

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(screen.getByText(/Count: 3/i)).toBeInTheDocument();
    });
  });

  describe('カウント減少機能', () => {
    it('-1ボタンをクリックすると値が1減る', () => {
      render(<Counter />);
      const decrementButton = screen.getByRole('button', { name: /-1/i });

      fireEvent.click(decrementButton);

      expect(screen.getByText(/Count: -1/i)).toBeInTheDocument();
    });

    it('-1ボタンを複数回クリックすると値が正しく減る', () => {
      render(<Counter />);
      const decrementButton = screen.getByRole('button', { name: /-1/i });

      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);

      expect(screen.getByText(/Count: -2/i)).toBeInTheDocument();
    });

    it('負の数にも対応している', () => {
      render(<Counter />);
      const decrementButton = screen.getByRole('button', { name: /-1/i });

      // 5回クリックして-5にする
      for (let i = 0; i < 5; i++) {
        fireEvent.click(decrementButton);
      }

      expect(screen.getByText(/Count: -5/i)).toBeInTheDocument();
    });
  });

  describe('リセット機能', () => {
    it('リセットボタンをクリックすると値が0になる', () => {
      render(<Counter />);
      const incrementButton = screen.getByRole('button', { name: /\+1/i });
      const resetButton = screen.getByRole('button', { name: /リセット/i });

      // カウントを増やす
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // リセット
      fireEvent.click(resetButton);

      expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
    });

    it('リセット後に再度カウント可能', () => {
      render(<Counter />);
      const incrementButton = screen.getByRole('button', { name: /\+1/i });
      const decrementButton = screen.getByRole('button', { name: /-1/i });
      const resetButton = screen.getByRole('button', { name: /リセット/i });

      // カウントアップ
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // リセット
      fireEvent.click(resetButton);

      // 再度カウントダウン
      fireEvent.click(decrementButton);

      expect(screen.getByText(/Count: -1/i)).toBeInTheDocument();
    });

    it('負の数からリセットできる', () => {
      render(<Counter />);
      const decrementButton = screen.getByRole('button', { name: /-1/i });
      const resetButton = screen.getByRole('button', { name: /リセット/i });

      // カウントダウン
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);

      // リセット
      fireEvent.click(resetButton);

      expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
    });
  });

  describe('複合操作', () => {
    it('増加・減少・リセットを組み合わせた操作が正しく動作する', () => {
      render(<Counter />);
      const incrementButton = screen.getByRole('button', { name: /\+1/i });
      const decrementButton = screen.getByRole('button', { name: /-1/i });
      const resetButton = screen.getByRole('button', { name: /リセット/i });

      // +3
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(screen.getByText(/Count: 3/i)).toBeInTheDocument();

      // -2 (3 -> 1)
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();

      // +5 (1 -> 6)
      for (let i = 0; i < 5; i++) {
        fireEvent.click(incrementButton);
      }
      expect(screen.getByText(/Count: 6/i)).toBeInTheDocument();

      // リセット
      fireEvent.click(resetButton);
      expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
    });
  });
});
