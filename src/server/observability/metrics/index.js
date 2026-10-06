import {
  createMetricsLogger,
  Unit,
  StorageResolution
} from 'aws-embedded-metrics'

/**
 * Create an AWS embedded-metrics counter.
 *
 * Shared between nrf-frontend (and available to nrf-backend), replacing the
 * duplicated metricsCounter helper. The gate can be a boolean or a thunk so
 * callers can pass `() => config.get('isMetricsEnabled')` and have the
 * config evaluated on every call.
 *
 * @param {object} [options]
 * @param {boolean | (() => boolean)} [options.isEnabled] - gate evaluated on
 * every call; metrics are skipped when falsy
 * @param {object} [options.logger] - logger with `.error()`; metric failures
 * are logged here and swallowed (metrics must never break the app). When
 * omitted, failures are swallowed silently
 * @returns {(metricName: string, value?: number) => Promise<void>} the
 * counter function
 */
export function createMetricsCounter({ isEnabled, logger } = {}) {
  return async function metricsCounter(metricName, value = 1) {
    const enabled = typeof isEnabled === 'function' ? isEnabled() : isEnabled

    if (!enabled) {
      return
    }

    try {
      const metricsLogger = createMetricsLogger()
      metricsLogger.putMetric(
        metricName,
        value,
        Unit.Count,
        StorageResolution.Standard
      )
      await metricsLogger.flush()
    } catch (error) {
      logger?.error(error, error.message)
    }
  }
}
