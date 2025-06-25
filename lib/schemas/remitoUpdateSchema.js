const Joi = require("joi");

// Schema específico para actualizar solo los campos básicos del remito
const remitoUpdateSchema = Joi.object().keys({
  numeroAsignado: Joi.string().required().min(3).max(255).messages({
    "any.required": "Número asignado es requerido",
    "string.min": "Número asignado debe tener al menos 3 caracteres",
    "string.max": "Número asignado no puede tener más de 255 caracteres",
    "string.empty": "Número asignado no puede estar vacío",
  }),
  observaciones: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Observaciones debe ser un texto",
    "string.max": "Observaciones no puede tener más de 500 caracteres",
  }),
  prioridad: Joi.string()
    .valid("normal", "alta", "urgente")
    .required()
    .messages({
      "any.required": "Prioridad es requerida",
      "any.only": "Prioridad sólo acepta normal, alta o urgente",
      "string.empty": "Prioridad no puede estar vacía",
    }),
  // Campos opcionales que pueden venir pero no son requeridos para la actualización básica
  archivoAdjunto: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Archivo adjunto debe ser un texto",
    "string.max": "Archivo adjunto no puede tener más de 500 caracteres",
  }),
  // Cliente y destino opcionales para permitir cambiarlos en la edición
  clienteId: Joi.number().integer().optional().messages({
    "number.base": "Cliente debe ser un número entero",
    "number.integer": "Cliente debe ser un número entero",
  }),
  destinoId: Joi.number().integer().optional().messages({
    "number.base": "Destino debe ser un número entero",
    "number.integer": "Destino debe ser un número entero",
  }),
});

module.exports = remitoUpdateSchema;
