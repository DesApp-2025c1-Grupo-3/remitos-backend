const {
  Contacto
} = require("../models");

const middleware = {};

const validateContactoId = async (req, res, next) => {
  const id = req.params.id;
  const contacto = await Contacto.findByPk(id);

  if (!contacto || !contacto.activo) {
    return res.status(404).json({
      message: `El contacto con id ${id} no existe`
    });
  }

  next();
};

middleware.validateContactoId = validateContactoId;
module.exports = middleware;
//# sourceMappingURL=contactoMiddleware.js.map