const { Remito } = require("../models");

const middleware = {};

const validateRemitoId = async (req, res, next) => {
  const id = req.params.id;
  const estado = await Remito.findByPk(id);

  if (!estado) {
    res.status(404).json({
      message: `El estado con id ${id} no existe`,
    });
  }

  next();
};

middleware.validateRemitoId = validateRemitoId;
module.exports = middleware;
//# sourceMappingURL=remitoMiddleware.js.map
