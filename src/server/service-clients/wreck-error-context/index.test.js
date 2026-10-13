import { wreckErrorContext } from './index.js'

describe('#wreckErrorContext', () => {
  it('should unwrap statusCode and responsePayload from a Wreck error', () => {
    const error = new Error('Response Error: 502')
    error.output = { statusCode: 502 }
    error.data = { payload: { message: 'Bad gateway' } }

    expect(wreckErrorContext(error)).toEqual({
      statusCode: 502,
      responsePayload: { message: 'Bad gateway' }
    })
  })

  it.each([
    [
      'missing output and data',
      {},
      { statusCode: undefined, responsePayload: undefined }
    ],
    [
      'missing output only',
      { data: { payload: { message: 'upstream body' } } },
      { statusCode: undefined, responsePayload: { message: 'upstream body' } }
    ],
    [
      'missing data only',
      { output: { statusCode: 404 } },
      { statusCode: 404, responsePayload: undefined }
    ]
  ])(
    'should optional-chain fields for a Wreck error with %s',
    (_, extra, expected) => {
      const error = new Error('Response Error')
      Object.assign(error, extra)

      expect(wreckErrorContext(error)).toEqual(expected)
    }
  )

  it('should return undefined fields for a plain error', () => {
    expect(wreckErrorContext(new Error('boom'))).toEqual({
      statusCode: undefined,
      responsePayload: undefined
    })
  })

  it('should return undefined fields for undefined', () => {
    expect(wreckErrorContext()).toEqual({
      statusCode: undefined,
      responsePayload: undefined
    })
  })
})
