import { QUOTE_ACCESS_STATUS } from './index.js'

describe('QUOTE_ACCESS_STATUS', () => {
  it('should match the quote access token outcome contract', () => {
    expect(QUOTE_ACCESS_STATUS).toEqual({
      valid: 'valid',
      invalid: 'invalid',
      expired: 'expired',
      notFound: 'not_found'
    })
  })
})
