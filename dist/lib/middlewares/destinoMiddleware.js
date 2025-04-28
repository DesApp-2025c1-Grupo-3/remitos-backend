const { Destino } = require("../models");

const middleware = {};

const validateDestinoId = async (req, res, next) => {
  const id = req.params.id;
  const estado = await Destino.findByPk(id);

  if (!estado) {
    res.status(404).json({
      message: `El estado con id ${id} no existe`,
    });
  }

  next();
};

middleware.validateDestinoId = validateDestinoId;
module.exports = middleware;
//# sourceMappingURL=destinoMiddleware.js.map
