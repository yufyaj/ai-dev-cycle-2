import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from '../Counter'

describe('Counter コンポーネント', () => {
  describe('初期表示', () => {
    it('初期値が0で表示される', () => {
      render(<Counter />)
      expect(screen.getByText(/count:\s*0/i)).toBeInTheDocument()
    })

    it('+1ボタンが表示される', () => {
      render(<Counter />)
      expect(screen.getByText('+1')).toBeInTheDocument()
    })

    it('-1ボタンが表示される', () => {
      render(<Counter />)
      expect(screen.getByText('-1')).toBeInTheDocument()
    })

    it('リセットボタンが表示される', () => {
      render(<Counter />)
      expect(screen.getByText('リセット')).toBeInTheDocument()
    })
  })

  describe('+1ボタンの動作', () => {
    it('+1ボタンをクリックすると値が1増える', () => {
      render(<Counter />)
      const incrementButton = screen.getByText('+1')

      fireEvent.click(incrementButton)
      expect(screen.getByText(/count:\s*1/i)).toBeInTheDocument()
    })

    it('+1ボタンを複数回クリックすると値が正しく増える', () => {
      render(<Counter />)
      const incrementButton = screen.getByText('+1')

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText(/count:\s*3/i)).toBeInTheDocument()
    })
  })

  describe('-1ボタンの動作', () => {
    it('-1ボタンをクリックすると値が1減る', () => {
      render(<Counter />)
      const decrementButton = screen.getByText('-1')

      fireEvent.click(decrementButton)
      expect(screen.getByText(/count:\s*-1/i)).toBeInTheDocument()
    })

    it('-1ボタンを複数回クリックすると値が正しく減る', () => {
      render(<Counter />)
      const decrementButton = screen.getByText('-1')

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(screen.getByText(/count:\s*-3/i)).toBeInTheDocument()
    })

    it('負の数にも対応している', () => {
      render(<Counter />)
      const decrementButton = screen.getByText('-1')

      fireEvent.click(decrementButton)
      expect(screen.getByText(/count:\s*-1/i)).toBeInTheDocument()

      fireEvent.click(decrementButton)
      expect(screen.getByText(/count:\s*-2/i)).toBeInTheDocument()
    })
  })

  describe('リセットボタンの動作', () => {
    it('リセットボタンをクリックすると値が0になる（正の値から）', () => {
      render(<Counter />)
      const incrementButton = screen.getByText('+1')
      const resetButton = screen.getByText('リセット')

      // カウントを増やす
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText(/count:\s*3/i)).toBeInTheDocument()

      // リセット
      fireEvent.click(resetButton)
      expect(screen.getByText(/count:\s*0/i)).toBeInTheDocument()
    })

    it('リセットボタンをクリックすると値が0になる（負の値から）', () => {
      render(<Counter />)
      const decrementButton = screen.getByText('-1')
      const resetButton = screen.getByText('リセット')

      // カウントを減らす
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(screen.getByText(/count:\s*-2/i)).toBeInTheDocument()

      // リセット
      fireEvent.click(resetButton)
      expect(screen.getByText(/count:\s*0/i)).toBeInTheDocument()
    })

    it('リセット後に再度カウント可能', () => {
      render(<Counter />)
      const incrementButton = screen.getByText('+1')
      const resetButton = screen.getByText('リセット')

      // カウントを増やす
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)

      // リセット
      fireEvent.click(resetButton)
      expect(screen.getByText(/count:\s*0/i)).toBeInTheDocument()

      // 再度カウントを増やす
      fireEvent.click(incrementButton)
      expect(screen.getByText(/count:\s*1/i)).toBeInTheDocument()
    })
  })

  describe('複合操作', () => {
    it('増減を組み合わせた操作が正しく動作する', () => {
      render(<Counter />)
      const incrementButton = screen.getByText('+1')
      const decrementButton = screen.getByText('-1')

      // +1を3回
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText(/count:\s*3/i)).toBeInTheDocument()

      // -1を2回
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(screen.getByText(/count:\s*1/i)).toBeInTheDocument()

      // +1を1回
      fireEvent.click(incrementButton)
      expect(screen.getByText(/count:\s*2/i)).toBeInTheDocument()
    })

    it('連続クリックでも正しく動作する', () => {
      render(<Counter />)
      const incrementButton = screen.getByText('+1')
      const decrementButton = screen.getByText('-1')

      // 素早く連続クリック
      for (let i = 0; i < 10; i++) {
        fireEvent.click(incrementButton)
      }
      expect(screen.getByText(/count:\s*10/i)).toBeInTheDocument()

      for (let i = 0; i < 5; i++) {
        fireEvent.click(decrementButton)
      }
      expect(screen.getByText(/count:\s*5/i)).toBeInTheDocument()
    })
  })
})
