const { Cliente, TipoEmpresa } = require("../models");
const { clienteSchema } = require('../schemas/clienteSchema');
const middleware = {};

// Middleware para validar datos de cliente
const validateCliente = (req, res, next) => {
  const { error } = clienteSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Datos de validación incorrectos',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar ID de cliente
const validateClienteId = async (req, res, next) => {
  const id = req.params.id;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      message: 'ID de cliente inválido'
    });
  }
  
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    return res.status(404).json({ message: `El cliente con id ${id} no existe` });
  }
  
  req.clienteId = parseInt(id);
  next();
};

// Middleware para validar que el tipo de empresa existe
const validateTipoEmpresaExists = async (req, res, next) => {
  const { tipoEmpresaId } = req.body;
  
  if (tipoEmpresaId) {
    const tipoEmpresa = await TipoEmpresa.findByPk(tipoEmpresaId);
    if (!tipoEmpresa) {
      return res.status(400).json({ 
        message: `El tipo de empresa con id ${tipoEmpresaId} no existe` 
      });
    }
  }
  
  next();
};

middleware.validateCliente = validateCliente;
middleware.validateClienteId = validateClienteId;
middleware.validateTipoEmpresaExists = validateTipoEmpresaExists;

module.exports = middleware;
