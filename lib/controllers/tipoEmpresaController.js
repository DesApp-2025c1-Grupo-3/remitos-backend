'use strict';

const { TipoEmpresa } = require('../models');

const tipoEmpresaController = {};

// Obtener todos los tipos de empresa
tipoEmpresaController.getAll = async (req, res) => {
  try {
    const tiposEmpresa = await TipoEmpresa.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
    
    res.json({
      success: true,
      data: tiposEmpresa
    });
  } catch (error) {
    console.error('Error al obtener tipos de empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un tipo de empresa por ID
tipoEmpresaController.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoEmpresa = await TipoEmpresa.findByPk(id);
    
    if (!tipoEmpresa) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de empresa no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: tipoEmpresa
    });
  } catch (error) {
    console.error('Error al obtener tipo de empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nuevo tipo de empresa
tipoEmpresaController.create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    // Validar que el nombre no esté duplicado
    const existingTipo = await TipoEmpresa.findOne({
      where: { nombre: nombre.trim() }
    });
    
    if (existingTipo) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un tipo de empresa con ese nombre'
      });
    }
    
    const nuevoTipo = await TipoEmpresa.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null
    });
    
    res.status(201).json({
      success: true,
      message: 'Tipo de empresa creado exitosamente',
      data: nuevoTipo
    });
  } catch (error) {
    console.error('Error al crear tipo de empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar tipo de empresa
tipoEmpresaController.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    
    const tipoEmpresa = await TipoEmpresa.findByPk(id);
    if (!tipoEmpresa) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de empresa no encontrado'
      });
    }
    
    // Validar que el nombre no esté duplicado (excluyendo el actual)
    if (nombre && nombre !== tipoEmpresa.nombre) {
      const existingTipo = await TipoEmpresa.findOne({
        where: { 
          nombre: nombre.trim(),
          id: { [require('sequelize').Op.ne]: id }
        }
      });
      
      if (existingTipo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un tipo de empresa con ese nombre'
        });
      }
    }
    
    await tipoEmpresa.update({
      nombre: nombre?.trim() || tipoEmpresa.nombre,
      descripcion: descripcion?.trim() || tipoEmpresa.descripcion,
      activo: activo !== undefined ? activo : tipoEmpresa.activo
    });
    
    res.json({
      success: true,
      message: 'Tipo de empresa actualizado exitosamente',
      data: tipoEmpresa
    });
  } catch (error) {
    console.error('Error al actualizar tipo de empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar tipo de empresa (soft delete)
tipoEmpresaController.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tipoEmpresa = await TipoEmpresa.findByPk(id);
    if (!tipoEmpresa) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de empresa no encontrado'
      });
    }
    
    // Verificar si hay clientes usando este tipo
    const clientesCount = await tipoEmpresa.countClientes();
    if (clientesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${clientesCount} cliente(s) usando este tipo de empresa`
      });
    }
    
    await tipoEmpresa.update({ activo: false });
    
    res.json({
      success: true,
      message: 'Tipo de empresa eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tipo de empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = tipoEmpresaController;
