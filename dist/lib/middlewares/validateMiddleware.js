const middleware = {};

const validateId = (modelo) => {
  return async (req, res, next) => {
    const id = req.params.id;

    try {
      const entidad = await modelo.findByPk(id);

      if (!entidad) {
        return res.status(404).json({
          message: `El recurso con id ${id} no existe.`,
        });
      }

      next();
    } catch (error) {
      console.error(
        `Error en validateId para el modelo ${modelo.name} y ID ${id}:`,
        error
      );
      return res.status(500).json({
        message: "Error interno del servidor al validar el ID.",
      });
    }
  };
};

middleware.validateId = validateId;
module.exports = middleware;
//# sourceMappingURL=validateMiddleware.js.map
