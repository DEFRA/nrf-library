import { describe, it, expect } from 'vitest'
import {
  BOUNDARY_ERRORS,
  KNOWN_BOUNDARY_ERROR_CODES,
  UPLOAD_REJECTION_CODES
} from './index.js'

describe('BOUNDARY_ERRORS', () => {
  it('groups codes under UPLOAD, GEOMETRY, and SERVICE', () => {
    expect(Object.keys(BOUNDARY_ERRORS)).toEqual([
      'UPLOAD',
      'GEOMETRY',
      'SERVICE'
    ])
  })

  it('has no duplicate code values across groups', () => {
    const allCodes = Object.values(BOUNDARY_ERRORS).flatMap((group) =>
      Object.values(group)
    )
    expect(new Set(allCodes).size).toBe(allCodes.length)
  })

  it('uses snake_case string values for every code', () => {
    const allCodes = Object.values(BOUNDARY_ERRORS).flatMap((group) =>
      Object.values(group)
    )
    for (const code of allCodes) {
      expect(code).toMatch(/^[a-z0-9]+(_[a-z0-9]+)*$/)
    }
  })
})

describe('KNOWN_BOUNDARY_ERROR_CODES', () => {
  it('contains every code declared in BOUNDARY_ERRORS', () => {
    const allCodes = Object.values(BOUNDARY_ERRORS).flatMap((group) =>
      Object.values(group)
    )
    for (const code of allCodes) {
      expect(KNOWN_BOUNDARY_ERROR_CODES.has(code)).toBe(true)
    }
  })

  it('does not contain an unrecognised code', () => {
    expect(KNOWN_BOUNDARY_ERROR_CODES.has('not_a_real_code')).toBe(false)
  })
})

describe('UPLOAD_REJECTION_CODES', () => {
  it('contains every UPLOAD-group code', () => {
    expect([...UPLOAD_REJECTION_CODES].sort()).toEqual(
      Object.values(BOUNDARY_ERRORS.UPLOAD).sort()
    )
  })

  it('excludes GEOMETRY and SERVICE codes', () => {
    for (const code of [
      ...Object.values(BOUNDARY_ERRORS.GEOMETRY),
      ...Object.values(BOUNDARY_ERRORS.SERVICE)
    ]) {
      expect(UPLOAD_REJECTION_CODES.has(code)).toBe(false)
    }
  })

  it('only contains recognised codes', () => {
    for (const code of UPLOAD_REJECTION_CODES) {
      expect(KNOWN_BOUNDARY_ERROR_CODES.has(code)).toBe(true)
    }
  })
})
