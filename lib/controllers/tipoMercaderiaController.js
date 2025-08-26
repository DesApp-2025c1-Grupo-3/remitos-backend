'use strict';

const { TipoMercaderia } = require('../models');

const tipoMercaderiaController = {};

// Obtener todos los tipos de mercadería
tipoMercaderiaController.getAll = async (req, res) => {
  try {
    const tiposMercaderia = await TipoMercaderia.findAll({
      where: { activo: true },
      order: [['nombre', 'ASC']]
    });
    
    res.json({
      success: true,
      data: tiposMercaderia
    });
  } catch (error) {
    console.error('Error al obtener tipos de mercadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un tipo de mercadería por ID
tipoMercaderiaController.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipoMercaderia = await TipoMercaderia.findByPk(id);
    
    if (!tipoMercaderia) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de mercadería no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: tipoMercaderia
    });
  } catch (error) {
    console.error('Error al obtener tipo de mercadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nuevo tipo de mercadería
tipoMercaderiaController.create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    // Validar que el nombre no esté duplicado
    const existingTipo = await TipoMercaderia.findOne({
      where: { nombre: nombre.trim() }
    });
    
    if (existingTipo) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un tipo de mercadería con ese nombre'
      });
    }
    
    const nuevoTipo = await TipoMercaderia.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null
    });
    
    res.status(201).json({
      success: true,
      message: 'Tipo de mercadería creado exitosamente',
      data: nuevoTipo
    });
  } catch (error) {
    console.error('Error al crear tipo de mercadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar tipo de mercadería
tipoMercaderiaController.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;
    
    const tipoMercaderia = await TipoMercaderia.findByPk(id);
    if (!tipoMercaderia) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de mercadería no encontrado'
      });
    }
    
    // Validar que el nombre no esté duplicado (excluyendo el actual)
    if (nombre && nombre !== tipoMercaderia.nombre) {
      const existingTipo = await TipoMercaderia.findOne({
        where: { 
          nombre: nombre.trim(),
          id: { [require('sequelize').Op.ne]: id }
        }
      });
      
      if (existingTipo) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un tipo de mercadería con ese nombre'
        });
      }
    }
    
    await tipoMercaderia.update({
      nombre: nombre?.trim() || tipoMercaderia.nombre,
      descripcion: descripcion?.trim() || tipoMercaderia.descripcion,
      activo: activo !== undefined ? activo : tipoMercaderia.activo
    });
    
    res.json({
      success: true,
      message: 'Tipo de mercadería actualizado exitosamente',
      data: tipoMercaderia
    });
  } catch (error) {
    console.error('Error al actualizar tipo de mercadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar tipo de mercadería (soft delete)
tipoMercaderiaController.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tipoMercaderia = await TipoMercaderia.findByPk(id);
    if (!tipoMercaderia) {
      return res.status(404).json({
        success: false,
        message: 'Tipo de mercadería no encontrado'
      });
    }
    
    // Verificar si hay mercaderías usando este tipo
    const mercaderiasCount = await tipoMercaderia.countMercaderia();
    if (mercaderiasCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${mercaderiasCount} mercadería(s) usando este tipo`
      });
    }
    
    await tipoMercaderia.update({ activo: false });
    
    res.json({
      success: true,
      message: 'Tipo de mercadería eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tipo de mercadería:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = tipoMercaderiaController;
