const JOI = require("joi");
const contactoSchema = require("./contactoSchema");

const destinoUpdateSchema = JOI.object().keys({
  nombre: JOI.string().min(3).max(255).messages({
    "string.empty": "Nombre no puede estar vacío",
    "string.min": "Nombre debe tener mínimo 3 caracteres",
    "string.max": "Nombre debe tener máximo 255 caracteres",
  }),
  pais: JOI.string().min(3).max(255).messages({
    "string.empty": "El país no puede estar vacío",
    "string.min": "El país debe tener mínimo 3 caracteres",
    "string.max": "El país debe tener máximo 255 caracteres",
  }),
  provincia: JOI.string().min(3).max(255).messages({
    "string.empty": "La provincia no puede estar vacía",
    "string.min": "La provincia debe tener mínimo 3 caracteres",
    "string.max": "La provincia debe tener máximo 255 caracteres",
  }),
  localidad: JOI.string().min(3).max(255).messages({
    "string.empty": "La localidad no puede estar vacía",
    "string.min": "La localidad debe tener mínimo 3 caracteres",
    "string.max": "La localidad debe tener máximo 255 caracteres",
  }),
  direccion: JOI.string().min(3).max(255).messages({
    "string.empty": "La dirección no puede estar vacía",
    "string.min": "La dirección debe tener mínimo 3 caracteres",
    "string.max": "La dirección debe tener máximo 255 caracteres",
  }),
  contactos: JOI.array().items(contactoSchema).messages({
    "array.base": "Contactos debe ser un arreglo",
  }),
});

module.exports = destinoUpdateSchema;
