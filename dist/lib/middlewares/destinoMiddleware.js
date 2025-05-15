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

const validarFiltroDestino = (req, res, next) => {
  const { pais, provincia, localidad } = req.query;
  const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

  for (const [campo, valor] of Object.entries({
    pais,
    provincia,
    localidad,
  })) {
    if (valor && (!soloLetras.test(valor) || valor.length > 100)) {
      return res.status(400).json({
        error: `El valor del parámetro "${campo}" es inválido.`,
      });
    }
  }

  next();
};

middleware.validarFiltroDestino = validarFiltroDestino;
module.exports = middleware;
//# sourceMappingURL=destinoMiddleware.js.map
