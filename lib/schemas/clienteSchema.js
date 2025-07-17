const JOI = require("joi");

// Schema básico para cliente sin contactos
const clienteSchema = JOI.object().keys({
  razonSocial: JOI.string().max(255).message({
    "string.max": "Razón social tiene un máximo de 255 carácteres",
  }),
  cuit_rut: JOI.string().max(255).message({
    "string.max": "CUIT o RUT tiene un máximo de 255 carácteres",
  }),
  direccion: JOI.string().required().min(3).max(255).message({
    "any.require": "Dirección es requerido",
    "string.min": "Dirección tiene un mínimo de 3 carácteres",
    "string.max": "Dirección tiene un máximo de 255 carácteres",
    "string.empty": "Dirección no puede estar vacío",
  }),
  tipoEmpresa: JOI.string()
    .required()
    .valid("Particular", "Empresa privada", "Organismo estatal")
    .min(3)
    .max(255)
    .message({
      "any.require": "tipoEmpresa es requerido",
      "string.min": "tipoEmpresa tiene un mínimo de 3 carácteres",
      "string.max": "tipoEmpresa tiene un máximo de 255 carácteres",
      "string.empty": "tipoEmpresa no puede estar vacío",
      "any.only":
        "tipoEmpresa debe ser 'Particular', 'Empresa privada' u 'Organismo estatal'",
    }),
});

// Schema para cliente con contactos
const clienteConContactosSchema = JOI.object().keys({
  razonSocial: JOI.string().max(255).message({
    "string.max": "Razón social tiene un máximo de 255 carácteres",
  }),
  cuit_rut: JOI.string().max(255).message({
    "string.max": "CUIT o RUT tiene un máximo de 255 carácteres",
  }),
  direccion: JOI.string().required().min(3).max(255).message({
    "any.require": "Dirección es requerido",
    "string.min": "Dirección tiene un mínimo de 3 carácteres",
    "string.max": "Dirección tiene un máximo de 255 carácteres",
    "string.empty": "Dirección no puede estar vacío",
  }),
  tipoEmpresa: JOI.string()
    .required()
    .valid("Particular", "Empresa privada", "Organismo estatal")
    .min(3)
    .max(255)
    .message({
      "any.require": "tipoEmpresa es requerido",
      "string.min": "tipoEmpresa tiene un mínimo de 3 carácteres",
      "string.max": "tipoEmpresa tiene un máximo de 255 carácteres",
      "string.empty": "tipoEmpresa no puede estar vacío",
      "any.only":
        "tipoEmpresa debe ser 'Particular', 'Empresa privada' u 'Organismo estatal'",
    }),
  contactos: JOI.array()
    .items(
      JOI.object({
        personaAutorizada: JOI.string().required().min(3).max(255).messages({
          "any.required": "La persona autorizada es requerida",
          "string.empty": "La persona autorizada no puede estar vacía",
          "string.min": "La persona autorizada debe tener mínimo 3 caracteres",
          "string.max":
            "La persona autorizada debe tener máximo 255 caracteres",
        }),
        correoElectronico: JOI.string().email().required().messages({
          "any.required": "El correo electrónico es requerido",
          "string.email": "Debe ser un correo electrónico válido",
          "string.empty": "El correo electrónico no puede estar vacío",
        }),
        telefono: JOI.string().required().messages({
          "any.required": "El teléfono es requerido",
          "string.empty": "El teléfono no puede estar vacío",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Debe incluir al menos un contacto",
      "any.required": "Los contactos son requeridos",
    }),
});

// Schema para cliente con un solo contacto (endpoint específico)
const clienteConUnContactoSchema = JOI.object().keys({
  razonSocial: JOI.string().max(255).message({
    "string.max": "Razón social tiene un máximo de 255 carácteres",
  }),
  cuit_rut: JOI.string().max(255).message({
    "string.max": "CUIT o RUT tiene un máximo de 255 carácteres",
  }),
  direccion: JOI.string().required().min(3).max(255).message({
    "any.require": "Dirección es requerido",
    "string.min": "Dirección tiene un mínimo de 3 carácteres",
    "string.max": "Dirección tiene un máximo de 255 carácteres",
    "string.empty": "Dirección no puede estar vacío",
  }),
  tipoEmpresa: JOI.string()
    .required()
    .valid("Particular", "Empresa privada", "Organismo estatal")
    .min(3)
    .max(255)
    .message({
      "any.require": "tipoEmpresa es requerido",
      "string.min": "tipoEmpresa tiene un mínimo de 3 carácteres",
      "string.max": "tipoEmpresa tiene un máximo de 255 carácteres",
      "string.empty": "tipoEmpresa no puede estar vacío",
      "any.only":
        "tipoEmpresa debe ser 'Particular', 'Empresa privada' u 'Organismo estatal'",
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
  telefono: JOI.string().required().messages({
    "any.required": "El teléfono es requerido",
    "string.empty": "El teléfono no puede estar vacío",
  }),
});

module.exports = {
  clienteSchema,
  clienteConContactosSchema,
  clienteConUnContactoSchema,
};
