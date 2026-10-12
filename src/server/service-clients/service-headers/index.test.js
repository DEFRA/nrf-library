import { vi } from 'vitest'
import { buildServiceHeaders } from './index.js'

vi.mock('@defra/hapi-tracing', () => ({
  withTraceId: vi.fn()
}))

import { withTraceId } from '@defra/hapi-tracing'

describe('#buildServiceHeaders', () => {
  describe('Trace header', () => {
    it('should include the trace header when withTraceId returns one', () => {
      vi.mocked(withTraceId).mockReturnValue({ 'x-cdp-request-id': 'trace-1' })

      const headers = buildServiceHeaders({
        traceHeaderName: 'x-cdp-request-id'
      })

      expect(withTraceId).toHaveBeenCalledWith('x-cdp-request-id', {})
      expect(headers['x-cdp-request-id']).toBe('trace-1')
    })

    it('should pass the configured trace header name through', () => {
      vi.mocked(withTraceId).mockReturnValue({})

      buildServiceHeaders({ traceHeaderName: 'x-custom-trace' })

      expect(withTraceId).toHaveBeenCalledWith('x-custom-trace', {})
    })
  })

  describe('Service key header', () => {
    it.each([
      ['x-api-key (default)', undefined, 'x-api-key'],
      ['x-data-sync-token (custom)', 'x-data-sync-token', 'x-data-sync-token']
    ])(
      'should set the service key under %s',
      (_, headerName, expectedHeader) => {
        vi.mocked(withTraceId).mockReturnValue({})

        const headers = buildServiceHeaders({
          traceHeaderName: 'x-cdp-request-id',
          serviceKey: 'secret-key',
          ...(headerName ? { serviceKeyHeaderName: headerName } : {})
        })

        expect(headers[expectedHeader]).toBe('secret-key')
      }
    )

    it.each([
      ['undefined', undefined],
      ['empty string', '']
    ])(
      'should omit the service key header when the key is %s',
      (_, serviceKey) => {
        vi.mocked(withTraceId).mockReturnValue({})

        const headers = buildServiceHeaders({
          traceHeaderName: 'x-cdp-request-id',
          serviceKey
        })

        expect(headers).toEqual({})
      }
    )
  })

  describe('Extra headers', () => {
    it('should merge extra headers into the base', () => {
      vi.mocked(withTraceId).mockImplementation((_name, headers) => headers)

      const headers = buildServiceHeaders({
        traceHeaderName: 'x-cdp-request-id',
        extraHeaders: { Authorization: 'Bearer token' }
      })

      expect(headers.Authorization).toBe('Bearer token')
    })

    it('should not mutate the caller’s extraHeaders object', () => {
      vi.mocked(withTraceId).mockImplementation((_name, headers) => headers)
      const extraHeaders = { Authorization: 'Bearer token' }

      buildServiceHeaders({
        traceHeaderName: 'x-cdp-request-id',
        serviceKey: 'secret-key',
        extraHeaders
      })

      expect(extraHeaders).toEqual({ Authorization: 'Bearer token' })
    })

    it('should let an active trace id win over a same-named extra header', () => {
      vi.mocked(withTraceId).mockReturnValue({
        'x-cdp-request-id': 'trace-1',
        stale: 'extra'
      })

      const headers = buildServiceHeaders({
        traceHeaderName: 'x-cdp-request-id',
        extraHeaders: { 'x-cdp-request-id': 'stale' }
      })

      expect(headers['x-cdp-request-id']).toBe('trace-1')
    })

    it('should let the service key win over a same-named extra header', () => {
      vi.mocked(withTraceId).mockImplementation((_name, headers) => headers)

      const headers = buildServiceHeaders({
        traceHeaderName: 'x-cdp-request-id',
        serviceKey: 'secret-key',
        extraHeaders: { 'x-api-key': 'stale' }
      })

      expect(headers['x-api-key']).toBe('secret-key')
    })
  })
})
