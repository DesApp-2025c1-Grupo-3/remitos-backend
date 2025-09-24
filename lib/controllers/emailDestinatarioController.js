const { EmailDestinatario } = require("../models");

// Obtener todos los destinatarios activos
const getEmailDestinatarios = async (req, res) => {
  try {
    const recipients = await EmailDestinatario.findAll({
      where: { activo: true },
      order: [['email', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: recipients
    });
  } catch (error) {
    console.error('Error obteniendo destinatarios:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener destinatarios"
    });
  }
};

// Crear un nuevo destinatario
const createEmailDestinatario = async (req, res) => {
  try {
    const { email, nombre } = req.body;
    
    // Validar que el email sea único (solo entre emails activos)
    const existingRecipient = await EmailDestinatario.findOne({ where: { email, activo: true } });
    if (existingRecipient) {
      return res.status(400).json({
        success: false,
        message: "Este email ya está registrado"
      });
    }

    // Si existe un destinatario desactivado con el mismo email, reactivarlo
    const inactiveRecipient = await EmailDestinatario.findOne({ where: { email, activo: false } });
    if (inactiveRecipient) {
      await inactiveRecipient.update({ 
        activo: true, 
        nombre: nombre || inactiveRecipient.nombre 
      });
      return res.status(200).json({
        success: true,
        data: inactiveRecipient,
        message: "Destinatario reactivado exitosamente"
      });
    }
    
    const newRecipient = await EmailDestinatario.create({
      email,
      nombre: nombre || null
    });
    
    res.status(201).json({
      success: true,
      data: newRecipient,
      message: "Destinatario agregado exitosamente"
    });
  } catch (error) {
    console.error('Error creando destinatario:', error);
    res.status(500).json({
      success: false,
      message: "Error al crear destinatario"
    });
  }
};

// Actualizar un destinatario
const updateEmailDestinatario = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nombre, activo } = req.body;
    
    const recipient = await EmailDestinatario.findByPk(id);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Destinatario no encontrado"
      });
    }
    
    // Si se está cambiando el email, validar que sea único (solo entre emails activos)
    if (email && email !== recipient.email) {
      const existingRecipient = await EmailDestinatario.findOne({ 
        where: { email, activo: true, id: { [require('sequelize').Op.ne]: id } } 
      });
      if (existingRecipient) {
        return res.status(400).json({
          success: false,
          message: "Este email ya está registrado"
        });
      }
    }
    
    await recipient.update({
      email: email || recipient.email,
      nombre: nombre !== undefined ? nombre : recipient.nombre,
      activo: activo !== undefined ? activo : recipient.activo
    });
    
    res.status(200).json({
      success: true,
      data: recipient,
      message: "Destinatario actualizado exitosamente"
    });
  } catch (error) {
    console.error('Error actualizando destinatario:', error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar destinatario"
    });
  }
};

// Eliminar (desactivar) un destinatario
const deleteEmailDestinatario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipient = await EmailDestinatario.findByPk(id);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Destinatario no encontrado"
      });
    }
    
    // En lugar de eliminar, desactivar
    await recipient.update({ activo: false });
    
    res.status(200).json({
      success: true,
      message: "Destinatario eliminado exitosamente"
    });
  } catch (error) {
    console.error('Error eliminando destinatario:', error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar destinatario"
    });
  }
};

module.exports = {
  getEmailDestinatarios,
  createEmailDestinatario,
  updateEmailDestinatario,
  deleteEmailDestinatario
};
