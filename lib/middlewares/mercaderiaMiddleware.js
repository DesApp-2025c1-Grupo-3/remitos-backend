const { Mercaderia, TipoMercaderia } = require("../models");
const { mercaderiaSchema } = require('../schemas/mercaderiaSchema');
const middleware = {};

// Middleware para validar datos de mercadería
const validateMercaderia = (req, res, next) => {
  const { error } = mercaderiaSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Datos de validación incorrectos',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar ID de mercadería
const validateMercaderiaId = async (req, res, next) => {
  const id = req.params.id;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      message: 'ID de mercadería inválido'
    });
  }
  
  const mercaderia = await Mercaderia.findByPk(id);
  if (!mercaderia) {
    return res.status(404).json({ message: `La mercadería con id ${id} no existe` });
  }
  
  req.mercaderiaId = parseInt(id);
  next();
};

// Middleware para validar que el tipo de mercadería existe
const validateTipoMercaderiaExists = async (req, res, next) => {
  const { tipoMercaderiaId } = req.body;
  
  if (tipoMercaderiaId) {
    const tipoMercaderia = await TipoMercaderia.findByPk(tipoMercaderiaId);
    if (!tipoMercaderia) {
      return res.status(400).json({ 
        message: `El tipo de mercadería con id ${tipoMercaderiaId} no existe` 
      });
    }
  }
  
  next();
};

middleware.validateMercaderia = validateMercaderia;
middleware.validateMercaderiaId = validateMercaderiaId;
middleware.validateTipoMercaderiaExists = validateTipoMercaderiaExists;

module.exports = middleware;
