const { Contacto } = require("../models");

const middleware = {};

const validateContactoId = async (req, res, next) => {
  const id = req.params.id;
  const estado = await Contacto.findByPk(id);

  if (!estado) {
    res.status(404).json({
      message: `El estado con id ${id} no existe`,
    });
  }

  next();
};

middleware.validateContactoId = validateContactoId;
module.exports = middleware;
//# sourceMappingURL=contactoMiddleware.js.map
