const Joi = require("joi");

const razonNoEntregaSchema = Joi.object({
  razonNoEntrega: Joi.string()
    .min(3) // mínimo 3 caracteres para que tenga sentido
    .pattern(/[a-zA-Z]/) // debe contener al menos una letra
    .required()
    .messages({
      "string.base": `"razonNoEntrega" debe ser un texto`,
      "string.empty": `"razonNoEntrega" no puede estar vacío`,
      "string.pattern.base": `"razonNoEntrega" debe contener al menos una letra`,
      "any.required": `"razonNoEntrega" es obligatorio`,
    }),
});

module.exports = { razonNoEntregaSchema };
