import hapiPino from 'hapi-pino'

import { createRequestLogger } from './index.js'

describe('#createRequestLogger', () => {
  const loggerOptions = { level: 'info', redact: ['req.headers.authorization'] }

  it('should return the hapi-pino plugin with the given options', () => {
    const requestLogger = createRequestLogger(loggerOptions)

    expect(requestLogger.plugin).toBe(hapiPino)
    expect(requestLogger.options).toEqual(loggerOptions)
  })

  it('should spread extra options before loggerOptions so loggerOptions wins', () => {
    const requestLogger = createRequestLogger(loggerOptions, {
      ignoreFunc: () => true,
      level: 'debug'
    })

    expect(requestLogger.options.ignoreFunc).toBeInstanceOf(Function)
    expect(requestLogger.options.level).toBe('info')
  })
})
