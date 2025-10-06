const Joi = require("joi");

const remitosByIdsSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(1)
    .required()
    .messages({
      "array.base": "ids debe ser un arreglo",
      "array.min": "Debe incluir al menos un id",
      "any.required": "ids es requerido",
      "number.base": "Cada id debe ser un número",
      "number.integer": "Cada id debe ser un entero",
      "number.min": "Cada id debe ser mayor a 0",
    }),
});

module.exports = remitosByIdsSchema;


