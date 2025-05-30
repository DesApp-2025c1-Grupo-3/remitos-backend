const JOI = require("joi");

const destinoContactoSchema = JOI.object().keys({
  name: JOI.string().required().min(3).max(255).messages({
      "any.required": "El name es requerido",
      "string.empty": "El name no puede estar vacío",
      "string.min": "El name debe tener mínimo 3 caracteres",
      "string.max": "El name debe tener máximo 255 caracteres",
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
  personaAutorizada: JOI.string().required().min(3).max(255).messages({
    "any.required": "La persona autorizada es requerida",
    "string.empty": "La persona autorizada no puede estar vacía",
    "string.min": "La persona autorizada debe tener mínimo 3 caracteres",
    "string.max": "La persona autorizada debe tener máximo 255 caracteres",
  }),
  correoElectronico: JOI.string().email().required().messages({
    "any.required": "El correo electrónico es requerido",
    "string.email": "Debe ser un correo electrónico válido",
    "string.empty": "El correo electrónico no puede estar vacío",
  }),
  telefono: JOI.number().integer().positive().required().messages({
    "any.required": "El teléfono es requerido",
    "number.base": "El teléfono debe ser un número",
    "number.integer": "El teléfono debe ser un número entero",
    "number.positive": "El teléfono debe ser un número positivo",
  }),
});

module.exports = destinoContactoSchema;
