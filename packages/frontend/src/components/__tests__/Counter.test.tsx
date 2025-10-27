import { render, screen, fireEvent } from '@testing-library/react'
import Counter from '../Counter'

describe('Counter', () => {
  describe('初期表示', () => {
    it('初期値0で表示される', () => {
      render(<Counter />)
      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('+1ボタンが表示される', () => {
      render(<Counter />)
      expect(screen.getByRole('button', { name: '+1' })).toBeInTheDocument()
    })

    it('-1ボタンが表示される', () => {
      render(<Counter />)
      expect(screen.getByRole('button', { name: '-1' })).toBeInTheDocument()
    })

    it('リセットボタンが表示される', () => {
      render(<Counter />)
      expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument()
    })
  })

  describe('+1ボタンの動作', () => {
    it('クリックすると値が1増える', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })

      fireEvent.click(incrementButton)

      expect(screen.getByText('Count: 1')).toBeInTheDocument()
    })

    it('複数回クリックすると正しく増加する', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)

      expect(screen.getByText('Count: 3')).toBeInTheDocument()
    })
  })

  describe('-1ボタンの動作', () => {
    it('クリックすると値が1減る', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(decrementButton)

      expect(screen.getByText('Count: -1')).toBeInTheDocument()
    })

    it('複数回クリックすると正しく減少する', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)

      expect(screen.getByText('Count: -2')).toBeInTheDocument()
    })

    it('負の数に対応している', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)

      expect(screen.getByText('Count: -3')).toBeInTheDocument()
    })
  })

  describe('リセットボタンの動作', () => {
    it('正の値から0にリセットされる', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText('Count: 2')).toBeInTheDocument()

      fireEvent.click(resetButton)

      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('負の値から0にリセットされる', () => {
      render(<Counter />)
      const decrementButton = screen.getByRole('button', { name: '-1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(screen.getByText('Count: -2')).toBeInTheDocument()

      fireEvent.click(resetButton)

      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })

    it('リセット後に再度カウントできる', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const resetButton = screen.getByRole('button', { name: 'リセット' })

      fireEvent.click(incrementButton)
      fireEvent.click(resetButton)
      expect(screen.getByText('Count: 0')).toBeInTheDocument()

      fireEvent.click(incrementButton)

      expect(screen.getByText('Count: 1')).toBeInTheDocument()
    })
  })

  describe('複合操作', () => {
    it('+1と-1を組み合わせて正しく動作する', () => {
      render(<Counter />)
      const incrementButton = screen.getByRole('button', { name: '+1' })
      const decrementButton = screen.getByRole('button', { name: '-1' })

      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      fireEvent.click(incrementButton)
      expect(screen.getByText('Count: 3')).toBeInTheDocument()

      fireEvent.click(decrementButton)
      expect(screen.getByText('Count: 2')).toBeInTheDocument()

      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      fireEvent.click(decrementButton)
      expect(screen.getByText('Count: -1')).toBeInTheDocument()
    })
  })
})
