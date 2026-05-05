/**
 * Utility to retry any async function until it succeeds.
 *
 * @template T
 * @param {object} params
 * @param {() => Promise<T>} params.operation - The async operation to execute and retry on failure.
 * @param {number} [params.retries=3] - Maximum number of attempts before rejecting.
 * @param {number} [params.intervalMs=1000] - Delay in milliseconds between retry attempts.
 * @param {{ info: Function }} [params.logger] - Optional logger; if provided, logs each retry via logger.info.
 * @returns {Promise<T>} Resolves with the operation's result, or rejects with the last error.
 */
export const retryAsyncOperation = ({
  operation,
  retries = 3,
  intervalMs = 1000,
  logger
}) => {
  return new Promise((resolve, reject) => {
    let retryCount = 0
    let intervalId = null

    const executeOperation = async () => {
      try {
        const result = await operation()
        if (intervalId) {
          clearInterval(intervalId)
        }
        resolve(result)
      } catch (error) {
        retryCount++
        logger?.info(
          { retry: retryCount },
          `Retrying operation, attempt ${retryCount} of ${retries}`
        )
        if (retryCount >= retries) {
          if (intervalId) {
            clearInterval(intervalId)
          }
          reject(error)
        } else if (retryCount === 1) {
          // If this is the first failure, set up the interval for retries
          intervalId = setInterval(() => {
            executeOperation()
          }, intervalMs)
        } else {
          // do nothing and wait for the next interval
        }
      }
    }

    // Execute the first attempt immediately
    executeOperation()
  })
}
