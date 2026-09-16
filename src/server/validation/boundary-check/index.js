// Joi schemas for the impact assessor's boundary-check response object,
// which nrf-backend receives from the impact assessor and re-serves
// verbatim to nrf-frontend. The two exported schemas intentionally differ
// in strictness: the backend only needs a loose wire-format check of its
// upstream, while the frontend validates the detailed shape before saving
// it to the user's session.
import joi from 'joi'

const requiredGeometryObject = joi.object().required()

const intersectingEdpItem = joi
  .object({
    label: joi.string().required(),
    overlap_area_ha: joi.number(),
    overlap_area_sqm: joi.number(),
    overlap_percentage: joi.number()
  })
  // Kept .unknown(true), and the overlap figures optional, so an additive
  // change to the boundary check API's EDP attributes doesn't 400 users
  // mid-journey — the view already renders each overlap figure
  // conditionally. label is required: the boundary check API always sends
  // one on an intersecting EDP.
  .unknown(true)

/**
 * Loose wire-format check of the impact-assessor's /check-boundary reply,
 * used by nrf-backend before re-serving the response.
 */
export const boundaryCheckResponseSchema = joi
  .object({
    boundaryGeometryOriginal: requiredGeometryObject,
    boundaryGeometryWgs84: requiredGeometryObject,
    intersectingEdps: joi.array().required(),
    intersectingExcludedAreas: joi.array().required(),
    boundaryMetadata: joi.any()
  })
  .unknown(true)

/**
 * Detailed shape nrf-frontend requires before saving the boundary check to
 * session — the value of payload.boundaryGeojson on the save-boundary route.
 */
export const boundaryGeojsonSchema = joi
  .object({
    intersectingEdps: joi.array().items(intersectingEdpItem).required(),
    intersectingExcludedAreas: joi.array().items(joi.string()).required(),
    boundaryGeometryWgs84: requiredGeometryObject,
    boundaryMetadata: joi.object().required(),
    boundaryGeometryOriginal: requiredGeometryObject
  })
  .required()
