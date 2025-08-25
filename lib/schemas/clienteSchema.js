const Joi = require('joi');

// Esquema de validación para cliente
const clienteSchema = Joi.object({
  razonSocial: Joi.string().max(255).allow(null, ''),
  cuit_rut: Joi.string().max(20).allow(null, ''),
  direccion: Joi.string().max(255).required(),
  tipoEmpresaId: Joi.number().integer().min(1).allow(null),
  activo: Joi.boolean()
});

module.exports = {
  clienteSchema
};
