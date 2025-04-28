const { where } = require("sequelize");
const { Contacto } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getContacto = async (req, res) => {
  const contactos = await Contacto.findAll({});
  res.status(200).json(contactos);
};
controller.getContacto = getContacto;

const getContactoById = async (req, res) => {
  const id = req.params.id;
  const contacto = await Contacto.findByPk(id);
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
  const contacto = await Contacto.destroy({ where: { id: idContacto } });
  res.status(200).json({ message: "Contacto eliminado correctamente" });
};

controller.deleteContacto = deleteContacto;

module.exports = controller;
