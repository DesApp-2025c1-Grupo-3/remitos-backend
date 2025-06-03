// clienteCompletoSchema.js
const Joi = require('joi');
const clienteSchema = require('../clienteSchema');
const contactoSchema = require('../contactoSchema');
const remitoSchema = require('../remitoSchema');

const clienteFullSchema = Joi.object({
  cliente: clienteSchema.required(),
  contacto: contactoSchema.required(),
  remito: remitoSchema.required()
});

module.exports = clienteFullSchema;
