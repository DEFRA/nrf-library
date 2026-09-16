// Joi schema for the impact assessor's PATCH /quotes/{reference} callback
// body: one entry per EDP with impact totals and levy figures. The shape is
// the wire contract between nrf-impact-assessor (which builds the payload in
// payload_mapper.py) and nrf-backend (which validates it), and is mirrored
// by nrf-backend's quote row mapper when the quote is served on.
import joi from 'joi'

const currencySchema = joi.number().precision(2).min(0).required()

const bandSchema = joi.number().integer().min(1).max(4).required()

const catchmentSchema = joi.object({
  label: joi.string().required(),
  catchmentId: joi.string().required().allow(null),
  catchmentOverlapPercentage: joi.number().min(0).max(100).required()
})

const impactMeasurementSchema = joi.object({
  amount: joi.number().precision(2).required(),
  unit: joi.string().valid('mg/I TP').required(),
  band: joi.object({
    min: bandSchema,
    max: bandSchema
  })
})

export const quotePatchSchema = joi.object({
  edps: joi
    .array()
    .items(
      joi.object({
        edpId: joi.number().integer().required(),
        edpName: joi.string().required(),
        edpType: joi.string().valid('NUTRIENT').required(),
        impact: joi
          .object({
            nitrogenTotal: impactMeasurementSchema.required(),
            phosphorusTotal: impactMeasurementSchema.required()
          })
          .required(),
        // Optional while the impact assessor rolls out catchments; make it
        // required once every callback sends them.
        catchments: joi.array().items(catchmentSchema),
        levyGbp: joi
          .object({
            amountExcludingVat: currencySchema,
            amountInflationAdjusted: currencySchema,
            baseAmount: currencySchema,
            modelVersion: joi.number().integer().min(1).required()
          })
          .required()
      })
    )
    .required()
})
