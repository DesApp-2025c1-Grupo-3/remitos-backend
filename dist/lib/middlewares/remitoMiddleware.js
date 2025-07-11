const { Remito } = require("../models");

const { Op } = require("sequelize");

const middleware = {};

const validateRemitoId = async (req, res, next) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);

  if (!remito) {
    return res.status(404).json({
      message: `El remito con id ${id} no existe`,
    });
  }

  next();
};

const validateNumeroAsignadoUnico = async (req, res, next) => {
  const { numeroAsignado } = req.body;

  if (!numeroAsignado) {
    return next(); // Si no hay numeroAsignado, no validamos unicidad
  }

  try {
    const remitoExistente = await Remito.findOne({
      where: {
        numeroAsignado,
      },
    });

    if (remitoExistente) {
      return res.status(409).json({
        message: "El número asignado ya está en uso",
      });
    }

    next();
  } catch (error) {
    console.error("Error al validar unicidad del número asignado:", error);
    return res.status(500).json({
      message: "Error al validar el número asignado",
    });
  }
};

const validateNumeroAsignadoUnicoUpdate = async (req, res, next) => {
  const { numeroAsignado } = req.body;
  const { id } = req.params;

  if (!numeroAsignado) {
    return next(); // Si no hay numeroAsignado, no validamos unicidad
  }

  try {
    const remitoExistente = await Remito.findOne({
      where: {
        numeroAsignado,
        id: {
          [Op.ne]: id,
        }, // Excluir el remito actual
      },
    });

    if (remitoExistente) {
      return res.status(409).json({
        message: "El número asignado ya está en uso",
      });
    }

    next();
  } catch (error) {
    console.error("Error al validar unicidad del número asignado:", error);
    return res.status(500).json({
      message: "Error al validar el número asignado",
    });
  }
};

middleware.validateRemitoId = validateRemitoId;
middleware.validateNumeroAsignadoUnico = validateNumeroAsignadoUnico;
middleware.validateNumeroAsignadoUnicoUpdate = validateNumeroAsignadoUnicoUpdate;
module.exports = middleware;
//# sourceMappingURL=remitoMiddleware.js.map
