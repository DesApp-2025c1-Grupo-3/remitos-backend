const JOI = require("joi");
const contactoSchema = require("./contactoSchema");

const clienteSchema = JOI.object().keys({
  razonSocial: JOI.string().max(255).message({
    //"string.min": "Razón social tiene un mínimo 3 carácteres",
    "string.max": "Razón social tiene un máximo de 255 carácteres",
    //"string.empty": "Razón social no puede estar vacío",
  }),
  cuit_rut: JOI.number().min(1).message({
    //"number.min": "CUIT o RUT tiene un mínimo de 3 carácteres",
    "number.max": "CUIT o RUT tiene un máximo de 255 carácteres",
    //"number.empty": "Telefono no puede estar vacío",
  }),
  direccion: JOI.string().required().min(3).max(255).message({
    "any.require": "Dirección es requerido",
    "string.min": "Dirección tiene un mínimo de 3 carácteres",
    "string.max": "Dirección tiene un máximo de 255 carácteres",
    "string.empty": "Dirección no puede estar vacío",
  }),
  tipoEmpresa: JOI.string()
    .required()
    .valid("particular", "empresa", "organismo estatal")
    .min(3)
    .max(255)
    .message({
      "any.require": "tipoEmpresa es requerido",
      "string.min": "tipoEmpresa tiene un mínimo de 3 carácteres",
      "string.max": "tipoEmpresa tiene un máximo de 255 carácteres",
      "string.empty": "tipoEmpresa no puede estar vacío",
      "any.only":
        "tipoEmpresa debe ser 'particular', 'empresa' u 'organismo estatal'",
    }),
  contactos: JOI.array().items(contactoSchema).min(1).required().messages({
    "array.base": "Contactos debe ser un arreglo",
    "array.min": "Debe haber al menos un contacto",
    "any.required": "El campo contactos es requerido",
  }),
});

module.exports = clienteSchema;
