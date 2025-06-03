const { Remito } = require("../models");
const middleware = {};

const validateRemitoId = async (req, res, next) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  if (!remito) {
    return res.status(404).json({ message: `El remito con id ${id} no existe` });
  }
  next();
};
middleware.validateRemitoId = validateRemitoId;

module.exports = middleware;
