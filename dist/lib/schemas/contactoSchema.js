const JOI = require("joi");

const contactoSchema = JOI.object().keys({
  personaAutorizada: JOI.string().required().min(3).max(255).message({
    "any.require": "Persona autorizada es requerido",
    "string.min": "Persona autorizada tiene un mínimo de 3 carácteres",
    "string.max": "Persona autorizada tiene un máximo de 3 carácteres",
    "string.empty": "Persona autoriza no puede estar vacío",
  }),
  correoElectronico: JOI.string().required().min(3).max(255).message({
    "any.require": "Correo electrónico es requerido",
    "string.min": "Correo electrónico tiene un mínimo de 3 carácteres",
    "string.max": "Correo electrónico tiene un máximo de 3 carácteres",
    "string.empty": "Correo electrónico no puede estar vacío",
  }),
  telefono: JOI.number().required().min(1).message({
    "any.require": "Telefono es requerido",
    "number.min": "Telefono tiene un mínimo de 3 carácteres",
    "number.max": "Telefono tiene un máximo de 255 carácteres",
  }), //PERMITE GUARDAR UNA LISTA DE TELEFONOS PERO ROMPE

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
