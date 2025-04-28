const JOI = require("joi");

const estadoSchema = JOI.object().keys({
  descripcion: JOI.string().required().min(3).max(50).message({
    "any.require": "Descripción es requerido",
    "string.min": "Descripción tiene un mínimo de 3 carácteres",
    "string.max": "Descripción tiene un máximo de 50 carácteres",
    "string.empty": "Descripción no puede estar vacío",
  }),
});
module.exports = estadoSchema;
//# sourceMappingURL=estadoSchema.js.map
