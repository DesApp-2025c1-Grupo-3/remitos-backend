const { Cliente } = require("../models");
const middleware = {};

const validateClienteId = async (req, res, next) => {
  const id = req.params.id;
  const estado = await Cliente.findByPk(id);
  if (!estado) {
    res.status(404).json({ message: `El estado con id ${id} no existe` });
  }
  next();
};
middleware.validateClienteId = validateClienteId;

module.exports = middleware;
