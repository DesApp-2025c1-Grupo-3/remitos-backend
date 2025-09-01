const Joi = require("joi");
const mercaderiaSchema = require("./mercaderiaSchema")

const remitoSchema = Joi.object().keys({
  // Campos de identificación
  numeroAsignado: Joi.string().required().min(3).max(255).messages({
    "any.required": "Número asignado es requerido",
    "string.min": "Número asignado debe tener al menos 3 caracteres",
    "string.max": "Número asignado no puede tener más de 255 caracteres",
    "string.empty": "Número asignado no puede estar vacío",
    "any.invalid": "El número asignado ya está en uso",
  }),

  // Relaciones FK (requeridas)
  clienteId: Joi.number().integer().min(1).required().messages({
    "any.required": "ID del cliente es requerido",
    "number.base": "ID del cliente debe ser un número",
    "number.integer": "ID del cliente debe ser un número entero",
    "number.min": "ID del cliente debe ser mayor a 0",
  }),

  estadoId: Joi.number().integer().min(1).required().messages({
    "any.required": "ID del estado es requerido",
    "number.base": "ID del estado debe ser un número",
    "number.integer": "ID del estado debe ser un número entero",
    "number.min": "ID del estado debe ser mayor a 0",
  }),

  mercaderias: Joi.array().items(mercaderiaSchema).min(1).required().messages({
    'array.base': 'Mercaderías debe ser un arreglo.',
    'array.min': 'Debe incluir al menos una mercadería.',
    'any.required': 'Debe incluir mercaderías.',
  }),

  observaciones: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Observaciones debe ser un texto",
    "string.max": "Observaciones no puede tener más de 500 caracteres",
  }),

  archivoAdjunto: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Archivo adjunto debe ser un texto",
    "string.max": "Archivo adjunto no puede tener más de 500 caracteres",
  }),

  prioridad: Joi.string()
    .valid("normal", "alta", "urgente")
    .required()
    .messages({
      "any.required": "Prioridad es requerido",
      "any.only": "Prioridad sólo acepta normal, alta o urgente",
      "string.empty": "Prioridad no puede estar vacío",
    }),

  // Campo para razón de no entrega (opcional)
  razonNoEntrega: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Razón de no entrega debe ser un texto",
    "string.max": "Razón de no entrega no puede tener más de 500 caracteres",
  }),
  fechaAgenda: Joi.date().optional().min(`now`).allow(null, "").messages({
    "date.base": "La fecha agenda debe ser una fecha válida.",
    "date.min": "La fecha agenda no puede ser anterior a hoy."
  }), 
  remitoFirmado: Joi.string().optional().allow(null, "").max(500).messages({
    "string.base": "Archivo adjunto debe ser un texto",
    "string.max": "Archivo adjunto no puede tener más de 500 caracteres",
  }),
});

module.exports = remitoSchema;
