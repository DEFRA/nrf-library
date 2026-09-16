import joi from 'joi'

import { boundaryCheckResponseSchema, boundaryGeojsonSchema } from './index.js'

const validEdp = {
  label: 'Norfolk Fens east',
  overlap_area_ha: 12.5,
  overlap_area_sqm: 125000,
  overlap_percentage: 34.2
}

const validBoundaryCheck = {
  boundaryGeometryOriginal: { type: 'Polygon' },
  boundaryGeometryWgs84: { type: 'Polygon' },
  intersectingEdps: [validEdp],
  intersectingExcludedAreas: ['Somerset Levels'],
  boundaryMetadata: { uprn: '123456789012' }
}

describe('boundaryCheckResponseSchema', () => {
  it('accepts a valid response', () => {
    const { error } = boundaryCheckResponseSchema.validate(validBoundaryCheck)
    expect(error).toBeUndefined()
  })

  it('accepts additional top-level keys', () => {
    const { error } = boundaryCheckResponseSchema.validate({
      ...validBoundaryCheck,
      newField: 'added by a later API version'
    })
    expect(error).toBeUndefined()
  })

  it('accepts any boundaryMetadata value', () => {
    const { error } = boundaryCheckResponseSchema.validate({
      ...validBoundaryCheck,
      boundaryMetadata: null
    })
    expect(error).toBeUndefined()
  })

  it('does not check intersectingEdps item shapes', () => {
    const { error } = boundaryCheckResponseSchema.validate({
      ...validBoundaryCheck,
      intersectingEdps: ['not-an-object']
    })
    expect(error).toBeUndefined()
  })

  it('rejects a missing geometry object', () => {
    const { boundaryGeometryWgs84: _, ...rest } = validBoundaryCheck
    const { error } = boundaryCheckResponseSchema.validate(rest)
    expect(error).toBeDefined()
  })

  it('rejects a non-array intersectingEdps', () => {
    const { error } = boundaryCheckResponseSchema.validate({
      ...validBoundaryCheck,
      intersectingEdps: validEdp
    })
    expect(error).toBeDefined()
  })
})

describe('boundaryGeojsonSchema', () => {
  it('accepts a valid boundary check object', () => {
    const { error } = boundaryGeojsonSchema.validate(validBoundaryCheck)
    expect(error).toBeUndefined()
  })

  it('accepts an EDP item without overlap figures', () => {
    const { error } = boundaryGeojsonSchema.validate({
      ...validBoundaryCheck,
      intersectingEdps: [{ label: 'Norfolk Fens east' }]
    })
    expect(error).toBeUndefined()
  })

  it('accepts unknown keys on an EDP item', () => {
    const { error } = boundaryGeojsonSchema.validate({
      ...validBoundaryCheck,
      intersectingEdps: [{ ...validEdp, catchments: [{ label: 'Broads' }] }]
    })
    expect(error).toBeUndefined()
  })

  it('accepts an empty intersectingEdps array', () => {
    const { error } = boundaryGeojsonSchema.validate({
      ...validBoundaryCheck,
      intersectingEdps: []
    })
    expect(error).toBeUndefined()
  })

  it('rejects an EDP item missing label', () => {
    const { label: _, ...rest } = validEdp
    const { error } = boundaryGeojsonSchema.validate({
      ...validBoundaryCheck,
      intersectingEdps: [rest]
    })
    expect(error).toBeDefined()
  })

  it('rejects a non-string excluded area', () => {
    const { error } = boundaryGeojsonSchema.validate({
      ...validBoundaryCheck,
      intersectingExcludedAreas: [42]
    })
    expect(error).toBeDefined()
  })

  it('rejects a non-object boundaryMetadata', () => {
    const { error } = boundaryGeojsonSchema.validate({
      ...validBoundaryCheck,
      boundaryMetadata: 'nope'
    })
    expect(error).toBeDefined()
  })

  it('is required when composed as a payload field', () => {
    const payloadSchema = joi.object({ boundaryGeojson: boundaryGeojsonSchema })
    const { error } = payloadSchema.validate({})
    expect(error).toBeDefined()
  })
})
