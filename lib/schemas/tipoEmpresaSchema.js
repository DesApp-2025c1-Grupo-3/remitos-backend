const Joi = require('joi');

// Esquema de validación para crear/actualizar tipo de empresa
const tipoEmpresaSchema = Joi.object({
  descripcion: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'La descripción debe tener al menos 2 caracteres',
      'string.max': 'La descripción no puede exceder los 100 caracteres',
      'string.empty': 'La descripción es requerida',
      'any.required': 'La descripción es requerida'
    })
});

module.exports = {
  tipoEmpresaSchema
};
