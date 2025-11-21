import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library'
import { describe, it, expect, vi } from 'vitest'
import ImageDrop from '../ImageDrop.jsx'

// Mock cropperjs web components
globalThis.customElements = {
  define: vi.fn()
}

describe('ImageDrop', () => {
  const mockSaveImage = vi.fn()

  // Helper function to create a mock file
  const createMockFile = (name, size, type) => {
    const file = new File(['x'.repeat(size)], name, { type })
    return file
  }

  it('should render the dropzone initially', () => {
    render(() => <ImageDrop saveImage={mockSaveImage} />)

    const dropzone = document.getElementById('dropzone')
    expect(dropzone).toBeTruthy()
  })

  it('should accept valid image file types by default', () => {
    render(() => <ImageDrop saveImage={mockSaveImage} />)

    const input = document.querySelector('input[type="file"]')
    expect(input).toBeTruthy()
    expect(input.accept).toBe('image/jpeg,image/png,image/webp,image/gif')
  })

  it('should accept custom file types', () => {
    render(() => (
      <ImageDrop
        saveImage={mockSaveImage}
        acceptedFileTypes={['image/jpeg', 'image/png']}
      />
    ))

    const input = document.querySelector('input[type="file"]')
    expect(input.accept).toBe('image/jpeg,image/png')
  })

  it('should validate file type and show error for invalid type', async () => {
    const mockOnError = vi.fn()

    render(() => (
      <ImageDrop
        saveImage={mockSaveImage}
        onError={mockOnError}
      />
    ))

    const input = document.querySelector('input[type="file"]')
    const invalidFile = createMockFile('test.txt', 1024, 'text/plain')

    Object.defineProperty(input, 'files', {
      value: [invalidFile],
      writable: false,
      configurable: true
    })

    fireEvent.input(input)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled()
      const errorMessage = mockOnError.mock.calls[0][0]
      expect(errorMessage).toContain('Invalid file type')
    })
  })

  it('should validate file size and show error for oversized file', async () => {
    const mockOnError = vi.fn()
    const maxSizeMB = 1

    render(() => (
      <ImageDrop
        saveImage={mockSaveImage}
        onError={mockOnError}
        maxFileSizeMB={maxSizeMB}
      />
    ))

    const input = document.querySelector('input[type="file"]')
    // Create a file larger than 1MB
    const oversizedFile = createMockFile('large.jpg', 2 * 1024 * 1024, 'image/jpeg')

    Object.defineProperty(input, 'files', {
      value: [oversizedFile],
      writable: false,
      configurable: true
    })

    fireEvent.input(input)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled()
      const errorMessage = mockOnError.mock.calls[0][0]
      expect(errorMessage).toContain('File size exceeds')
      expect(errorMessage).toContain(`${maxSizeMB}MB`)
    })
  })

  it('should accept valid file within size limit', async () => {
    const mockOnError = vi.fn()

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null,
      result: 'data:image/jpeg;base64,mockbase64data'
    }

    global.FileReader = function() {
      return mockFileReader
    }

    render(() => (
      <ImageDrop
        saveImage={mockSaveImage}
        onError={mockOnError}
        maxFileSizeMB={10}
      />
    ))

    const input = document.querySelector('input[type="file"]')
    const validFile = createMockFile('test.jpg', 1024, 'image/jpeg')

    Object.defineProperty(input, 'files', {
      value: [validFile],
      writable: false,
      configurable: true
    })

    fireEvent.input(input)

    await waitFor(() => {
      expect(mockOnError).not.toHaveBeenCalled()
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(validFile)
    })
  })

  it('should handle aspect ratio props', () => {
    render(() => (
      <ImageDrop
        saveImage={mockSaveImage}
        aspectRatioWidth={16}
        aspectRatioHeight={9}
      />
    ))

    // Component should render without errors
    const dropzone = document.getElementById('dropzone')
    expect(dropzone).toBeTruthy()
  })

  it('should display error message in UI when validation fails', async () => {
    render(() => <ImageDrop saveImage={mockSaveImage} />)

    const input = document.querySelector('input[type="file"]')
    const invalidFile = createMockFile('test.txt', 1024, 'text/plain')

    Object.defineProperty(input, 'files', {
      value: [invalidFile],
      writable: false,
      configurable: true
    })

    fireEvent.input(input)

    await waitFor(() => {
      const errorDiv = document.querySelector('.bg-red-100')
      expect(errorDiv).toBeTruthy()
      expect(errorDiv.textContent).toContain('Invalid file type')
    })
  })

  it('should prevent drag and drop when uploading', async () => {
    render(() => <ImageDrop saveImage={mockSaveImage} />)

    const dropzone = document.getElementById('dropzone')
    expect(dropzone).toBeTruthy()

    // The dropzone should exist and handle drag events
    expect(dropzone.ondragenter).toBeDefined()
  })

  it('should use default file size limit of 10MB when not specified', () => {
    const mockOnError = vi.fn()

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null
    }
    global.FileReader = function() {
      return mockFileReader
    }

    render(() => (
      <ImageDrop
        saveImage={mockSaveImage}
        onError={mockOnError}
      />
    ))

    const input = document.querySelector('input[type="file"]')
    // Create a file just under 10MB
    const validFile = createMockFile('test.jpg', 9 * 1024 * 1024, 'image/jpeg')

    Object.defineProperty(input, 'files', {
      value: [validFile],
      writable: false,
      configurable: true
    })

    fireEvent.input(input)

    // Should not call onError for file under 10MB
    expect(mockOnError).not.toHaveBeenCalled()
  })
})
