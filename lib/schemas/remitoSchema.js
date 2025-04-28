const Joi = require("joi");

const remitoSchema = Joi.object().keys({
  numeroAsignado: Joi.string().required().min(3).max(255).messages({
    "any.required": "Número asignado es requerido",
    "string.min": "Número asignado debe tener al menos 3 caracteres",
    "string.max": "Número asignado no puede tener más de 255 caracteres",
    "string.empty": "Número asignado no puede estar vacío",
  }),
  tipoMercaderia: Joi.string().required().min(3).max(255).messages({
    "any.required": "Tipo de mercadería es requerido",
    "string.min": "Tipo de mercadería debe tener al menos 3 caracteres",
    "string.max": "Tipo de mercadería no puede tener más de 255 caracteres",
    "string.empty": "Tipo de mercadería no puede estar vacío",
  }),
  valorDeclarado: Joi.number().integer().required().min(0).messages({
    "any.required": "Valor declarado es requerido",
    "number.base": "Valor declarado debe ser un número",
    "number.integer": "Valor declarado debe ser un número entero",
    "number.min": "Valor declarado no puede ser negativo",
  }),
  volumenMetrosCubico: Joi.number().integer().required().min(0).messages({
    "any.required": "Volumen en metros cúbicos es requerido",
    "number.base": "Volumen en metros cúbicos debe ser un número",
    "number.integer": "Volumen en metros cúbicos debe ser un número entero",
    "number.min": "Volumen en metros cúbicos no puede ser negativo",
  }),
  pesoMercaderia: Joi.number().integer().required().min(0).messages({
    "any.required": "Peso de mercadería es requerido",
    "number.base": "Peso de mercadería debe ser un número",
    "number.integer": "Peso de mercadería debe ser un número entero",
    "number.min": "Peso de mercadería no puede ser negativo",
  }),
  fechaEmision: Joi.date().optional().messages({
    "date.base": "Fecha de emisión debe ser una fecha válida",
  }),
  cantidadBobinas: Joi.number()
    .integer()
    .optional()
    .allow(null)
    .min(0)
    .messages({
      "number.base": "Cantidad de bobinas debe ser un número",
      "number.integer": "Cantidad de bobinas debe ser un número entero",
      "number.min": "Cantidad de bobinas no puede ser negativa",
    }),
  cantidadRacks: Joi.number().integer().optional().allow(null).min(0).messages({
    "number.base": "Cantidad de racks debe ser un número",
    "number.integer": "Cantidad de racks debe ser un número entero",
    "number.min": "Cantidad de racks no puede ser negativa",
  }),
  cantidadBultos: Joi.number()
    .integer()
    .optional()
    .allow(null)
    .min(0)
    .messages({
      "number.base": "Cantidad de bultos debe ser un número",
      "number.integer": "Cantidad de bultos debe ser un número entero",
      "number.min": "Cantidad de bultos no puede ser negativa",
    }),
  cantidadPallets: Joi.number()
    .integer()
    .optional()
    .allow(null)
    .min(0)
    .messages({
      "number.base": "Cantidad de pallets debe ser un número",
      "number.integer": "Cantidad de pallets debe ser un número entero",
      "number.min": "Cantidad de pallets no puede ser negativa",
    }),
  requisitosEspeciales: Joi.string()
    .optional()
    .allow(null, "")
    .max(500)
    .messages({
      "string.base": "Requisitos especiales debe ser un texto",
      "string.max":
        "Requisitos especiales no puede tener más de 500 caracteres",
    }),
  observaciones: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Observaciones debe ser un texto",
    "string.max": "Observaciones no puede tener más de 500 caracteres",
  }),
  archivoAdjunto: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Archivo adjunto debe ser un texto",
    "string.max": "Archivo adjunto no puede tener más de 500 caracteres",
  }),
});

module.exports = remitoSchema;
