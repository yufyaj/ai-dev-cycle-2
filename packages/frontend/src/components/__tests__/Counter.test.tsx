import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from '../Counter'

describe('Counter コンポーネント', () => {
  describe('初期表示', () => {
    it('初期値として0を表示すること', () => {
      render(<Counter />)
      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('+1ボタンが表示されること', () => {
      render(<Counter />)
      expect(screen.getByRole('button', { name: '+1' })).toBeInTheDocument()
    })

    it('-1ボタンが表示されること', () => {
      render(<Counter />)
      expect(screen.getByRole('button', { name: '-1' })).toBeInTheDocument()
    })

    it('リセットボタンが表示されること', () => {
      render(<Counter />)
      expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument()
    })
  })

  describe('+1ボタンの動作', () => {
    it('+1ボタンをクリックすると値が1増えること', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })

      fireEvent.click(incrementButton)

      expect(screen.getByText('Count: 1')).toBeInTheDocument()
    })

    it('+1ボタンを複数回クリックすると値が正しく増えること', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)

      expect(screen.getByText('Count: 3')).toBeInTheDocument()
    })
  })

  describe('-1ボタンの動作', () => {
    it('-1ボタンをクリックすると値が1減ること', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(decrementButton)

      expect(screen.getByText('Count: -1')).toBeInTheDocument()
    })

    it('-1ボタンを複数回クリックすると値が正しく減ること', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)

      expect(screen.getByText('Count: -2')).toBeInTheDocument()
    })

    it('負の数になっても正しく動作すること', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)

      expect(screen.getByText('Count: -3')).toBeInTheDocument()
    })
  })

  describe('リセットボタンの動作', () => {
    it('リセットボタンをクリックすると値が0になること', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      // 値を増やす
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText('Count: 2')).toBeInTheDocument()

      // リセット
      fireEvent.click(resetButton)
      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('負の値からリセットできること', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      // 値を減らす
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(screen.getByText('Count: -2')).toBeInTheDocument()

      // リセット
      fireEvent.click(resetButton)
      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('リセット後に再度カウント可能であること', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      // 値を増やす
      fireEvent.click(incrementButton)

      // リセット
      fireEvent.click(resetButton)

      // 再度増やす
      fireEvent.click(incrementButton)
      expect(screen.getByText('Count: 1')).toBeInTheDocument()
    })
  })

  describe('複合操作', () => {
    it('+1と-1を組み合わせて使えること', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText('Count: 3')).toBeInTheDocument()

      fireEvent.click(decrementButton)
      expect(screen.getByText('Count: 2')).toBeInTheDocument()
    })

    it('連続してボタンをクリックしても正しく動作すること', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const decrementButton = screen.getByRole('button', { name: '-1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      // 5回増やす
      for (let i = 0; i < 5; i++) {
        fireEvent.click(incrementButton)
      }
      expect(screen.getByText('Count: 5')).toBeInTheDocument()

      // 3回減らす
      for (let i = 0; i < 3; i++) {
        fireEvent.click(decrementButton)
      }
      expect(screen.getByText('Count: 2')).toBeInTheDocument()

      // リセット
      fireEvent.click(resetButton)
      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })
  })
})
