const JOI = require("joi");
const contactoSchema = require("./contactoSchema");

const destinoSchema = JOI.object().keys({
  nombre: JOI.string().min(3).max(255).messages({
    "string.empty": "Nombre no puede estar vacío",
    "string.min": "Nombre debe tener mínimo 3 caracteres",
    "string.max": "Nombre debe tener máximo 255 caracteres",
  }),
  pais: JOI.string().required().min(3).max(255).messages({
    "any.required": "El país es requerido",
    "string.empty": "El país no puede estar vacío",
    "string.min": "El país debe tener mínimo 3 caracteres",
    "string.max": "El país debe tener máximo 255 caracteres",
  }),
  provincia: JOI.string().required().min(3).max(255).messages({
    "any.required": "La provincia es requerida",
    "string.empty": "La provincia no puede estar vacía",
    "string.min": "La provincia debe tener mínimo 3 caracteres",
    "string.max": "La provincia debe tener máximo 255 caracteres",
  }),
  localidad: JOI.string().required().min(3).max(255).messages({
    "any.required": "La localidad es requerida",
    "string.empty": "La localidad no puede estar vacía",
    "string.min": "La localidad debe tener mínimo 3 caracteres",
    "string.max": "La localidad debe tener máximo 255 caracteres",
  }),
  direccion: JOI.string().required().min(3).max(255).messages({
    "any.required": "La dirección es requerida",
    "string.empty": "La dirección no puede estar vacía",
    "string.min": "La dirección debe tener mínimo 3 caracteres",
    "string.max": "La dirección debe tener máximo 255 caracteres",
  }),
  contactos: JOI.array().items(contactoSchema).min(1).required().messages({
    "array.base": "Contactos debe ser un arreglo",
    "array.min": "Debe haber al menos un contacto",
    "any.required": "El campo contactos es requerido",
  }),
});

module.exports = destinoSchema;
