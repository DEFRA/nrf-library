import { structureErrorForECS } from './index.js'

describe('#structureErrorForECS', () => {
  it('should return an empty object for falsy input', () => {
    expect(structureErrorForECS(null)).toEqual({})
    expect(structureErrorForECS(undefined)).toEqual({})
  })

  it('should return error message and type for a basic Error', () => {
    const error = new Error('something went wrong')

    const result = structureErrorForECS(error)

    expect(result.error.message).toBe('something went wrong')
    expect(result.error.type).toBe('Error')
    expect(result.error.stack_trace).toBe(error.stack)
  })

  it('should return error type from error.name when set', () => {
    const error = new Error('custom')
    error.name = 'CustomError'

    const result = structureErrorForECS(error)

    expect(result.error.type).toBe('CustomError')
  })

  it('should include error code when present', () => {
    const error = new Error('enoent')
    error.code = 'ENOENT'

    const result = structureErrorForECS(error)

    expect(result.error.code).toBe('ENOENT')
  })

  it('should omit code when not present', () => {
    const result = structureErrorForECS(new Error('no code'))

    expect(result.error).not.toHaveProperty('code')
  })

  it('should not include the http field when no status code is present', () => {
    const result = structureErrorForECS(new Error('no status'))

    expect(result).not.toHaveProperty('http')
  })

  it.each([
    ['statusCode', { statusCode: 404 }, 404],
    ['status', { status: 400 }, 400],
    ['response.statusCode', { response: { statusCode: 502 } }, 502],
    ['output.statusCode (Boom)', { output: { statusCode: 500 } }, 500]
  ])('should extract the status code from error.%s', (_, props, expected) => {
    const result = structureErrorForECS(
      Object.assign(new Error('failed'), props)
    )

    expect(result.http).toEqual({ response: { status_code: expected } })
  })

  it('should append response data payload to message when error.data is present', () => {
    const error = new Error('request failed')
    error.data = { reason: 'invalid input' }

    const result = structureErrorForECS(error)

    expect(result.error.message).toBe(
      'request failed | response: {"reason":"invalid input"}'
    )
  })

  it('should append a string payload as-is', () => {
    const error = new Error('request failed')
    error.data = 'bad payload'

    const result = structureErrorForECS(error)

    expect(result.error.message).toBe('request failed | response: bad payload')
  })

  it('should append response.data payload to message when present', () => {
    const error = new Error('upstream failed')
    error.response = { data: { detail: 'timeout' } }

    const result = structureErrorForECS(error)

    expect(result.error.message).toBe(
      'upstream failed | response: {"detail":"timeout"}'
    )
  })

  it('should fall back to String(error) when message is not a string', () => {
    const error = { message: 42, toString: () => 'stringified error' }

    const result = structureErrorForECS(error)

    expect(result.error.message).toBe('stringified error')
  })

  it('should fall back to the base message when payload cannot be serialised', () => {
    const error = new Error('serialisation failed')
    const circular = {}
    circular.self = circular
    error.data = circular

    const result = structureErrorForECS(error)

    expect(result.error.message).toBe('serialisation failed')
  })

  it('should omit stack_trace when the error has no stack', () => {
    const error = new Error('no stack')
    delete error.stack

    const result = structureErrorForECS(error)

    expect(result.error).not.toHaveProperty('stack_trace')
  })

  it('should fall back to the constructor name when error.name is falsy', () => {
    class DatabaseError extends Error {}
    const error = new DatabaseError('db error')
    error.name = ''

    const result = structureErrorForECS(error)

    expect(result.error.type).toBe('DatabaseError')
  })

  it('should fall back to "Error" when name and constructor name are absent', () => {
    const error = Object.assign(Object.create(null), { message: 'no proto' })

    const result = structureErrorForECS(error)

    expect(result.error.type).toBe('Error')
  })
})
