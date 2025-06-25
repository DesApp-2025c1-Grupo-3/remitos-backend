const Joi = require("joi");

const mercaderiaSchema = Joi.object({
  tipoMercaderia: Joi.string().required().messages({
    "string.base": `"tipoMercaderia" debe ser un texto`,
    "any.required": `"tipoMercaderia" es obligatorio`,
    "string.empty": `"tipoMercaderia" no puede estar vacío`,
  }),
  valorDeclarado: Joi.number().integer().required().messages({
    "number.base": `"valorDeclarado" debe ser un número`,
    "number.integer": `"valorDeclarado" debe ser un número entero`,
    "any.required": `"valorDeclarado" es obligatorio`,
  }),
  volumenMetrosCubico: Joi.number().integer().required().messages({
    "number.base": `"volumenMetrosCubico" debe ser un número`,
    "number.integer": `"volumenMetrosCubico" debe ser un número entero`,
    "any.required": `"volumenMetrosCubico" es obligatorio`,
  }),
  pesoMercaderia: Joi.number().integer().required().messages({
    "number.base": `"pesoMercaderia" debe ser un número`,
    "number.integer": `"pesoMercaderia" debe ser un número entero`,
    "any.required": `"pesoMercaderia" es obligatorio`,
  }),
  cantidadBobinas: Joi.number().integer().optional().allow(null).messages({
    "number.base": `"cantidadBobinas" debe ser un número`,
    "number.integer": `"cantidadBobinas" debe ser un número entero`,
  }),
  cantidadRacks: Joi.number().integer().optional().allow(null).messages({
    "number.base": `"cantidadRacks" debe ser un número`,
    "number.integer": `"cantidadRacks" debe ser un número entero`,
  }),
  cantidadBultos: Joi.number().integer().optional().allow(null).messages({
    "number.base": `"cantidadBultos" debe ser un número`,
    "number.integer": `"cantidadBultos" debe ser un número entero`,
  }),
  cantidadPallets: Joi.number().integer().optional().allow(null).messages({
    "number.base": `"cantidadPallets" debe ser un número`,
    "number.integer": `"cantidadPallets" debe ser un número entero`,
  }),
  requisitosEspeciales: Joi.string().optional().allow(null, "").messages({
    "string.base": `"requisitosEspeciales" debe ser un texto`,
  }),
  activo: Joi.boolean().optional().messages({
    "boolean.base": `"activo" debe ser true o false`,
  }),
  estadoId: Joi.number().integer().optional().allow(null).messages({
    "number.base": `"estadoId" debe ser un número`,
    "number.integer": `"estadoId" debe ser un número entero`,
  }),
});

module.exports = mercaderiaSchema;
