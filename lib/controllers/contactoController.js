const { where } = require("sequelize");
const { Contacto, Cliente, Destino } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getContacto = async (req, res) => {
  const contactos = await Contacto.findAll({
    include: {
      model: Cliente,
      as: "cliente",
    },
  });
  res.status(200).json(contactos);
};
controller.getContacto = getContacto;

const getContactoById = async (req, res) => {
  const id = req.params.id;
  const contacto = await Contacto.findByPk(id, {
    include: [
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Destino,
        as: "destino",
      },
    ],
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

const deleteContacto = async (req, res) => {
  const idContacto = req.params.id;
  const contacto = await Contacto.findByPk(idContacto);
  await contacto.update({ activo: false });
  res.status(200).json({ message: "Contacto eliminado correctamente" });
};
controller.deleteContacto = deleteContacto;

const activateContacto = async (req, res) => {
  const idContacto = req.params.id;
  const contacto = await Contacto.findByPk(idContacto);
  await contacto.update({ activo: true });
  res.status(200).json(contacto);
};
controller.activateContacto = activateContacto;

const updateContacto = async (req, res) => {
  const id = req.params.id;
  const { personaAutoriza, correoElectronico, telefono } = req.body;
  const contacto = await Contacto.findByPk(id);
  await contacto.update({ personaAutoriza, correoElectronico, telefono });
  res.status(200).json(contacto);
};
controller.updateContacto = updateContacto;

module.exports = controller;
