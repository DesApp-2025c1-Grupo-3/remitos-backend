const { tipoEmpresaSchema } = require('../schemas/tipoEmpresaSchema');

// Middleware para validar datos de tipo de empresa
const validateTipoEmpresa = (req, res, next) => {
  const { error } = tipoEmpresaSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Datos de validación incorrectos',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar ID de tipo de empresa
const validateTipoEmpresaId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      message: 'ID de tipo de empresa inválido'
    });
  }
  
  req.tipoEmpresaId = parseInt(id);
  next();
};

module.exports = {
  validateTipoEmpresa,
  validateTipoEmpresaId
};
