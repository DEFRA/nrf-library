import { vi } from 'vitest'
import { getRequestFromService } from './index.js'

vi.mock('@hapi/wreck', () => ({
  default: { get: vi.fn() }
}))

import Wreck from '@hapi/wreck'

describe('#getRequestFromService', () => {
  it('should call Wreck.get with the url, json and headers', async () => {
    const mockResponse = { payload: { status: 'ok' } }
    vi.mocked(Wreck.get).mockResolvedValue(mockResponse)
    const headers = { 'x-api-key': 'secret' }

    const result = await getRequestFromService({
      url: 'http://localhost:4001/quotes/NRL-123456',
      headers,
      logger: { error: vi.fn() }
    })

    expect(Wreck.get).toHaveBeenCalledWith(
      'http://localhost:4001/quotes/NRL-123456',
      { json: true, headers }
    )
    expect(result).toBe(mockResponse)
  })

  it('should default to empty headers when none are provided', async () => {
    vi.mocked(Wreck.get).mockResolvedValue({ payload: {} })

    await getRequestFromService({
      url: 'http://localhost:4001/health',
      logger: { error: vi.fn() }
    })

    expect(Wreck.get).toHaveBeenCalledWith('http://localhost:4001/health', {
      json: true,
      headers: {}
    })
  })

  describe('On failure', () => {
    it('should log with the custom error message and rethrow', async () => {
      const error = new Error('Network error')
      vi.mocked(Wreck.get).mockRejectedValue(error)
      const logger = { error: vi.fn() }

      await expect(
        getRequestFromService({
          url: 'http://localhost:4001/quotes',
          logger,
          errorMessage: 'GET request to backend failed'
        })
      ).rejects.toThrow('Network error')

      expect(logger.error).toHaveBeenCalledWith(
        error,
        'GET request to backend failed'
      )
    })

    it('should log with the default error message when none is provided', async () => {
      const error = new Error('Network error')
      vi.mocked(Wreck.get).mockRejectedValue(error)
      const logger = { error: vi.fn() }

      await expect(
        getRequestFromService({
          url: 'http://localhost:4001/quotes',
          logger
        })
      ).rejects.toThrow('Network error')

      expect(logger.error).toHaveBeenCalledWith(error, 'Service request failed')
    })
  })
})
