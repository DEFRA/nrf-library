import { buildLogger } from './index.js'

describe('#buildLogger', () => {
  it('should return a pino logger honouring the given options', () => {
    const logger = buildLogger({ level: 'warn' })

    expect(logger.level).toBe('warn')
    expect(typeof logger.info).toBe('function')
  })

  it('should return a new instance per call', () => {
    const first = buildLogger({ level: 'info' })
    const second = buildLogger({ level: 'info' })

    expect(first).not.toBe(second)
  })
})
