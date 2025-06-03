const { Cliente } = require("../models");
const middleware = {};

const validateClienteId = async (req, res, next) => {
  const id = req.params.id;
  const cliente = await Cliente.findByPk(id);
  if (!cliente || !cliente.activo) {
    return res.status(404).json({ message: `El Cliente con id ${id} no existe` });
  }
  next();
};
middleware.validateClienteId = validateClienteId;

module.exports = middleware;
