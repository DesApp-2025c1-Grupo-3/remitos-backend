const Joi = require('joi');
const clienteSchema = require('../clienteSchema');
const contactoSchema = require('../contactoSchema');

const clienteContactoSchema = Joi.object({
  cliente: clienteSchema.required(),
  contacto: contactoSchema.required()
}); 

module.exports = clienteContactoSchema;