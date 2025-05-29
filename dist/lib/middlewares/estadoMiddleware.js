const {
  Estado
} = require("../models");

const middleware = {};

const validateEstadoId = async (req, res, next) => {
  const {
    id
  } = req.params;
  const estado = await Estado.findByPk(id);

  if (!estado || !estado.activo) {
    // Check if the estado exists and is active
    return res.status(404).json({
      message: "Estado no encontrado o inactivo."
    });
  }

  next();
};

middleware.validateEstadoId = validateEstadoId;
module.exports = middleware;
//# sourceMappingURL=estadoMiddleware.js.map