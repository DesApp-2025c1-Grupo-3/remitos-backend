const Estado = require("../models/estado");
const middleware = {};

const validateEstadoId = async (req, res, next) => {
  const id = req.params.id;
  const estado = await Estado.findByPk({ id });
  if (!estado) {
    res.status(404).json({ message: `El estado con id ${id} no existe` });
  }
  next();
};
middleware.validateEstadoId = validateEstadoId;

module.exports = middleware;
