import { StorageResolution, Unit } from 'aws-embedded-metrics'

import { createMetricsCounter } from './index.js'

const mockPutMetric = vi.fn()
const mockFlush = vi.fn()
const mockLoggerError = vi.fn()

vi.mock(import('aws-embedded-metrics'), async (importOriginal) => {
  const original = await importOriginal()

  return {
    ...original,
    createMetricsLogger: () => ({
      putMetric: mockPutMetric,
      flush: mockFlush
    })
  }
})

const mockMetricsName = 'mock-metrics-name'
const defaultMetricsValue = 1
const mockValue = 200

describe('#createMetricsCounter', () => {
  beforeEach(() => {
    mockPutMetric.mockClear()
    mockFlush.mockClear()
    mockLoggerError.mockClear()
  })

  describe('When the counter is disabled', () => {
    it('should not emit metrics when isEnabled is false', async () => {
      const metricsCounter = createMetricsCounter({ isEnabled: false })

      await metricsCounter(mockMetricsName, mockValue)

      expect(mockPutMetric).not.toHaveBeenCalled()
      expect(mockFlush).not.toHaveBeenCalled()
    })

    it('should not emit metrics when the isEnabled thunk returns false', async () => {
      const metricsCounter = createMetricsCounter({ isEnabled: () => false })

      await metricsCounter(mockMetricsName, mockValue)

      expect(mockPutMetric).not.toHaveBeenCalled()
    })
  })

  describe('When the counter is enabled', () => {
    it('should send a metric with the default value', async () => {
      const metricsCounter = createMetricsCounter({ isEnabled: true })

      await metricsCounter(mockMetricsName)

      expect(mockPutMetric).toHaveBeenCalledWith(
        mockMetricsName,
        defaultMetricsValue,
        Unit.Count,
        StorageResolution.Standard
      )
    })

    it('should send a metric with the given value and flush it', async () => {
      const metricsCounter = createMetricsCounter({ isEnabled: true })

      await metricsCounter(mockMetricsName, mockValue)

      expect(mockPutMetric).toHaveBeenCalledWith(
        mockMetricsName,
        mockValue,
        Unit.Count,
        StorageResolution.Standard
      )
      expect(mockFlush).toHaveBeenCalled()
    })

    it('should evaluate the isEnabled thunk on every call', async () => {
      let enabled = true
      const metricsCounter = createMetricsCounter({ isEnabled: () => enabled })

      await metricsCounter(mockMetricsName)
      expect(mockPutMetric).toHaveBeenCalledTimes(1)

      enabled = false
      await metricsCounter(mockMetricsName)
      expect(mockPutMetric).toHaveBeenCalledTimes(1)
    })
  })

  describe('When emitting a metric throws', () => {
    const mockError = 'mock-metrics-flush-error'

    it('should log the error and swallow it', async () => {
      mockFlush.mockRejectedValueOnce(new Error(mockError))
      const metricsCounter = createMetricsCounter({
        isEnabled: true,
        logger: { error: mockLoggerError }
      })

      await expect(
        metricsCounter(mockMetricsName, mockValue)
      ).resolves.toBeUndefined()

      expect(mockLoggerError).toHaveBeenCalledWith(Error(mockError), mockError)
    })

    it('should swallow the error when no logger is provided', async () => {
      mockFlush.mockRejectedValueOnce(new Error(mockError))
      const metricsCounter = createMetricsCounter({ isEnabled: true })

      await expect(
        metricsCounter(mockMetricsName, mockValue)
      ).resolves.toBeUndefined()
    })
  })
})
