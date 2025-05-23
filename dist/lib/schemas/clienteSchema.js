const JOI = require("joi");

const clienteSchema = JOI.object().keys({
  razonSocial: JOI.string().max(255).message({
    //"string.min": "Razón social tiene un mínimo 3 carácteres",
    "string.max": "Razón social tiene un máximo de 255 carácteres" //"string.empty": "Razón social no puede estar vacío",

  }),
  cuit_rut: JOI.number().min(1).message({
    //"number.min": "CUIT o RUT tiene un mínimo de 3 carácteres",
    "number.max": "CUIT o RUT tiene un máximo de 255 carácteres" //"number.empty": "Telefono no puede estar vacío",

  }),
  direccion: JOI.string().required().min(3).max(255).message({
    "any.require": "Dirección es requerido",
    "string.min": "Dirección tiene un mínimo de 3 carácteres",
    "string.max": "Dirección tiene un máximo de 255 carácteres",
    "string.empty": "Dirección no puede estar vacío"
  }),
  tipoEmpresa: JOI.string().required().valid("particular", "empresa", "organismo estatal").min(3).max(255).message({
    "any.require": "tipoEmpresa es requerido",
    "string.min": "tipoEmpresa tiene un mínimo de 3 carácteres",
    "string.max": "tipoEmpresa tiene un máximo de 255 carácteres",
    "string.empty": "tipoEmpresa no puede estar vacío",
    "any.only": "tipoEmpresa debe ser 'particular', 'empresa' u 'organismo estatal'"
  }),
  personaAutorizada: JOI.string().required().min(3).max(255).messages({
    "any.required": "La persona autorizada es requerida",
    "string.empty": "La persona autorizada no puede estar vacía",
    "string.min": "La persona autorizada debe tener mínimo 3 caracteres",
    "string.max": "La persona autorizada debe tener máximo 255 caracteres"
  }),
  correoElectronico: JOI.string().email().required().messages({
    "any.required": "El correo electrónico es requerido",
    "string.email": "Debe ser un correo electrónico válido",
    "string.empty": "El correo electrónico no puede estar vacío"
  }),
  telefono: JOI.number().integer().positive().required().messages({
    "any.required": "El teléfono es requerido",
    "number.base": "El teléfono debe ser un número",
    "number.integer": "El teléfono debe ser un número entero",
    "number.positive": "El teléfono debe ser un número positivo"
  })
});
module.exports = clienteSchema;
//# sourceMappingURL=clienteSchema.js.map