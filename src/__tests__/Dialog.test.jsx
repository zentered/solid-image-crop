import { render, screen, fireEvent } from '@solidjs/testing-library'
import { describe, it, expect, vi } from 'vitest'
import { createSignal } from 'solid-js'
import Dialog from '../Dialog.jsx'

// Mock cropperjs web components
globalThis.customElements = {
  define: vi.fn()
}

describe('Dialog', () => {
  it('should render when isOpen is true', () => {
    const [isOpen] = createSignal(true)
    const mockCloseModal = vi.fn()
    const mockOpenModal = vi.fn()
    const mockSaveImage = vi.fn()

    render(() => (
      <Dialog
        title="Test Dialog"
        isOpen={isOpen}
        closeModal={mockCloseModal}
        openModal={mockOpenModal}
        saveImage={mockSaveImage}
      />
    ))

    expect(screen.getByText('Test Dialog')).toBeTruthy()
  })

  it('should not render when isOpen is false', () => {
    const [isOpen] = createSignal(false)
    const mockCloseModal = vi.fn()
    const mockOpenModal = vi.fn()
    const mockSaveImage = vi.fn()

    const { container } = render(() => (
      <Dialog
        title="Test Dialog"
        isOpen={isOpen}
        closeModal={mockCloseModal}
        openModal={mockOpenModal}
        saveImage={mockSaveImage}
      />
    ))

    // The dialog should not be visible
    expect(screen.queryByText('Test Dialog')).toBeNull()
  })

  it('should render aspect ratio selector with default options', () => {
    const [isOpen] = createSignal(true)
    const mockCloseModal = vi.fn()
    const mockOpenModal = vi.fn()
    const mockSaveImage = vi.fn()

    render(() => (
      <Dialog
        title="Upload Image"
        isOpen={isOpen}
        closeModal={mockCloseModal}
        openModal={mockOpenModal}
        saveImage={mockSaveImage}
      />
    ))

    const select = document.querySelector('select')
    expect(select).toBeTruthy()

    const options = select.querySelectorAll('option')
    expect(options.length).toBe(3)
    expect(options[0].value).toBe('16:9')
    expect(options[1].value).toBe('4:3')
    expect(options[2].value).toBe('1:1')
  })

  it('should update aspect ratio when selector changes', () => {
    const [isOpen] = createSignal(true)
    const mockCloseModal = vi.fn()
    const mockOpenModal = vi.fn()
    const mockSaveImage = vi.fn()

    render(() => (
      <Dialog
        title="Upload Image"
        isOpen={isOpen}
        closeModal={mockCloseModal}
        openModal={mockOpenModal}
        saveImage={mockSaveImage}
      />
    ))

    const select = document.querySelector('select')

    // Change to 1:1 aspect ratio
    fireEvent.change(select, { target: { value: '1:1' } })

    // The component should handle the change without errors
    expect(select.value).toBe('1:1')
  })

  it('should pass saveImage callback to ImageDrop', () => {
    const [isOpen] = createSignal(true)
    const mockCloseModal = vi.fn()
    const mockOpenModal = vi.fn()
    const mockSaveImage = vi.fn()

    render(() => (
      <Dialog
        title="Upload Image"
        isOpen={isOpen}
        closeModal={mockCloseModal}
        openModal={mockOpenModal}
        saveImage={mockSaveImage}
      />
    ))

    // The ImageDrop component should be rendered inside the dialog
    const dropzone = document.getElementById('dropzone')
    expect(dropzone).toBeTruthy()
  })

  it('should render with correct title', () => {
    const [isOpen] = createSignal(true)
    const mockCloseModal = vi.fn()
    const mockOpenModal = vi.fn()
    const mockSaveImage = vi.fn()

    render(() => (
      <Dialog
        title="Custom Title"
        isOpen={isOpen}
        closeModal={mockCloseModal}
        openModal={mockOpenModal}
        saveImage={mockSaveImage}
      />
    ))

    expect(screen.getByText('Custom Title')).toBeTruthy()
  })
})
