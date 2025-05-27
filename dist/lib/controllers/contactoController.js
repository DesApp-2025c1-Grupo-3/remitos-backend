const {
  where
} = require("sequelize");

const {
  Contacto,
  Cliente,
  Destino
} = require("../models");

const {
  message
} = require("../schemas/estadoSchema");

const controller = {};

const getContacto = async (req, res) => {
  const contactos = await Contacto.findAll({
    include: {
      model: Cliente,
      as: "cliente"
    }
  });
  res.status(200).json(contactos);
};

controller.getContacto = getContacto;

const getContactoById = async (req, res) => {
  const id = req.params.id;
  const contacto = await Contacto.findByPk(id, {
    include: [{
      model: Cliente,
      as: "cliente"
    }, {
      model: Destino,
      as: "destino"
    }]
  });
  res.status(200).json(contacto);
};

controller.getContactoById = getContactoById;

const createContacto = async (req, res) => {
  const contacto = req.body;
  const nuevoContacto = await Contacto.create(contacto);
  res.status(201).json(nuevoContacto);
};

controller.createContacto = createContacto;

const updateContacto = async (req, res) => {
  const id = req.params.id;
  const {
    personaAutoriza,
    correoElectronico,
    telefono
  } = req.body;
  const contacto = await Contacto.findByPk(id);
  await contacto.update({
    personaAutoriza,
    correoElectronico,
    telefono
  });
  res.status(200).json(contacto);
};

controller.updateContacto = updateContacto; // Se elimina el contacto marcándolo como inactivo, no se elimina de la base de datos.

const deleteContacto = async (req, res) => {
  const contactoId = req.params.id;
  const contacto = await Contacto.findByPk(contactoId);
  await contacto.update({
    activo: false
  });
  res.status(200).json({
    message: "Contacto eliminado."
  });
};

controller.deleteContacto = deleteContacto;
/* // Si se quiere eliminar de la base de datos, se puede usar este método
   //  pero es mejor usar un campo activo para no perder el historial de contactos.
const deleteContacto = async (req, res) => {
  const idContacto = req.params.id;
  const contacto = await Contacto.destroy({ where: { id: idContacto } });
  res.status(200).json({ message: "Contacto eliminado correctamente" });
};
controller.deleteContacto = deleteContacto;
*/

module.exports = controller;
//# sourceMappingURL=contactoController.js.map