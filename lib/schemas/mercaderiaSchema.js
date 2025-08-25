const Joi = require('joi');

// Esquema de validación para mercadería
const mercaderiaSchema = Joi.object({
  tipoMercaderiaId: Joi.number().integer().min(1).required(),
  valorDeclarado: Joi.number().integer().min(0).required(),
  volumenMetrosCubico: Joi.number().integer().min(0).required(),
  pesoMercaderia: Joi.number().integer().min(0).required(),
  cantidadBobinas: Joi.number().integer().min(0).allow(null),
  cantidadRacks: Joi.number().integer().min(0).allow(null),
  cantidadBultos: Joi.number().integer().min(0).allow(null),
  cantidadPallets: Joi.number().integer().min(0).allow(null),
  requisitosEspeciales: Joi.string().max(500).allow(null, ''),
  activo: Joi.boolean(),
  estadoId: Joi.number().integer().min(1).allow(null)
});

module.exports = {
  mercaderiaSchema
};
