// Setup file for Vitest
import { afterEach } from 'vitest'
import { cleanup } from '@solidjs/testing-library'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
