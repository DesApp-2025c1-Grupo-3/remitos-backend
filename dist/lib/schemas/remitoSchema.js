const Joi = require("joi");

const remitoSchema = Joi.object().keys({
  numeroAsignado: Joi.string().required().min(3).max(255).messages({
    "any.required": "Número asignado es requerido",
    "string.min": "Número asignado debe tener al menos 3 caracteres",
    "string.max": "Número asignado no puede tener más de 255 caracteres",
    "string.empty": "Número asignado no puede estar vacío"
  }),
  fechaEmision: Joi.date().optional().messages({
    "date.base": "Fecha de emisión debe ser una fecha válida"
  }),
  observaciones: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Observaciones debe ser un texto",
    "string.max": "Observaciones no puede tener más de 500 caracteres"
  }),
  archivoAdjunto: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Archivo adjunto debe ser un texto",
    "string.max": "Archivo adjunto no puede tener más de 500 caracteres"
  }),
  prioridad: Joi.string().valid("normal", "alta", "urgente").required().messages({
    "any.require": "Prioridad es requerido",
    "any.only": "Prioridad sólo acepta normal, alta o urgente",
    "string.empty": "tipoEmpresa no puede estar vacío"
  })
});
module.exports = remitoSchema;
//# sourceMappingURL=remitoSchema.js.map