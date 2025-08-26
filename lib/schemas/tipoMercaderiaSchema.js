'use strict';

const Joi = require('joi');

const tipoMercaderiaSchema = {
  create: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'any.required': 'El nombre es requerido',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'string.empty': 'El nombre no puede estar vacío'
      }),
    descripcion: Joi.string()
      .max(500)
      .optional()
      .allow('')
      .messages({
        'string.max': 'La descripción no puede exceder 500 caracteres'
      })
  }),

  update: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'string.empty': 'El nombre no puede estar vacío'
      }),
    descripcion: Joi.string()
      .max(500)
      .optional()
      .allow('')
      .messages({
        'string.max': 'La descripción no puede exceder 500 caracteres'
      }),
    activo: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'El campo activo debe ser un valor booleano'
      })
  })
};

module.exports = tipoMercaderiaSchema;
