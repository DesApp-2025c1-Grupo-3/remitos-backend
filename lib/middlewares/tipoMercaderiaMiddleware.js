const { tipoMercaderiaSchema } = require('../schemas/tipoMercaderiaSchema');

// Middleware para validar datos de tipo de mercadería
const validateTipoMercaderia = (req, res, next) => {
  const { error } = tipoMercaderiaSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Datos de validación incorrectos',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar ID de tipo de mercadería
const validateTipoMercaderiaId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      message: 'ID de tipo de mercadería inválido'
    });
  }
  
  req.tipoMercaderiaId = parseInt(id);
  next();
};

module.exports = {
  validateTipoMercaderia,
  validateTipoMercaderiaId
};
