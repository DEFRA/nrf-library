import { describe, it, expect } from 'vitest'
import { MAX_BOUNDARY_FILE_SIZE_MB } from './index.js'

describe('MAX_BOUNDARY_FILE_SIZE_MB', () => {
  it('is a positive number', () => {
    expect(typeof MAX_BOUNDARY_FILE_SIZE_MB).toBe('number')
    expect(MAX_BOUNDARY_FILE_SIZE_MB).toBeGreaterThan(0)
  })
})
