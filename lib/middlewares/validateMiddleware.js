const middleware = {};

const validateId = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id;
    const estado = await modelo.findByPk(id);
    if (!estado) {
      res.status(404).json({ message: `El estado con id ${id} no existe` });
    }
    next();
  };
};
middleware.validateId = validateId;

module.exports = middleware;
