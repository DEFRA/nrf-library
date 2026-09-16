import {
  referencePattern,
  tokenPattern,
  referenceParam,
  tokenParam
} from './index.js'

describe('referencePattern', () => {
  it.each(['NRL-123456', 'NRL-000000'])('accepts %s', (reference) => {
    expect(referencePattern.test(reference)).toBe(true)
  })

  it.each([
    'NRL-12345',
    'NRL-1234567',
    'nrl-123456',
    'NRL_123456',
    'QUOTE-123456'
  ])('rejects %s', (reference) => {
    expect(new RegExp(`^${referencePattern.source}$`).test(reference)).toBe(
      false
    )
  })
})

describe('tokenPattern', () => {
  it('accepts URL-safe characters', () => {
    expect(new RegExp(`^${tokenPattern.source}$`).test('abcXYZ019-_')).toBe(
      true
    )
  })

  it.each(['token with spaces', 'token/with/slashes', ''])(
    'rejects %s',
    (token) => {
      expect(new RegExp(`^${tokenPattern.source}$`).test(token)).toBe(false)
    }
  )
})

describe('referenceParam', () => {
  it('accepts a valid reference', () => {
    const { error } = referenceParam.validate('NRL-123456')
    expect(error).toBeUndefined()
  })

  it.each([undefined, '', 'NRL-12345', 'nrl-123456'])(
    'rejects %s',
    (reference) => {
      const { error } = referenceParam.validate(reference)
      expect(error).toBeDefined()
    }
  )
})

describe('tokenParam', () => {
  it('accepts a valid token', () => {
    const { error } = tokenParam.validate('abcXYZ019-_')
    expect(error).toBeUndefined()
  })

  it.each([undefined, '', 'not a token'])('rejects %s', (token) => {
    const { error } = tokenParam.validate(token)
    expect(error).toBeDefined()
  })
})
