const JOI = require("joi");

const contactoSchema = JOI.object().keys({
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
  }) //PERMITE GUARDAR UNA LISTA DE TELEFONOS PERO ROMPE

  /*telefono: JOI.array()
    .items(
        JOI.number()
            .min(3)  // Como número, no se refiere a caracteres, sino al valor mínimo
            .max(9999999999)  // Ajusta el límite máximo si lo necesitas
            .required()
            .messages({
                "number.min": "Cada teléfono debe tener un valor mínimo",
                "number.max": "Cada teléfono debe tener un valor máximo",
                "number.empty": "El teléfono no puede estar vacío"
            })
    )
    .min(1)
    .required()
  })*/

});
module.exports = contactoSchema;
//# sourceMappingURL=contactoSchema.js.map