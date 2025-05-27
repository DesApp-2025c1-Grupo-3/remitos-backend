const { where } = require("sequelize");
const { Destino, Contacto } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getDestino = async (req, res) => {
  const destinos = await Destino.findAll({
    include: { model: Contacto, as: "contactos" },
  });
  res.status(200).json(destinos);
};
controller.getDestino = getDestino;

const getDestinoById = async (req, res) => {
  const id = req.params.id;
  const destinos = await Destino.findAll(id, {
    include: { model: Contacto, as: "contactos" },
  });
  res.status(200).json(destinos);
};
controller.getDestinoById = getDestinoById;

const getDestinoFiltrado = async (req, res) => {
  const { pais, provincia, localidad } = req.query;
  const filtros = {};
  if (pais) filtros.pais = pais;
  if (provincia) filtros.provincia = provincia;
  if (localidad) filtros.localidad = localidad;
  const destinos = await Destino.findAll({ where: filtros });
  res.status(200).json(destinos);
};
controller.getDestinoFiltrado = getDestinoFiltrado;

const createDestino = async (req, res) => {
  const destino = req.body;
  const nuevoDestino = await Destino.create(destino);
  res.status(201).json(nuevoDestino);
};
controller.createDestino = createDestino;

const createDestinoWithContacto = async (req, res) => {
  const {
    pais,
    provincia,
    localidad,
    direccion,
    personaAutorizada,
    correoElectronico,
    telefono,
  } = req.body;
  const destino = await Destino.create({
    pais,
    provincia,
    localidad,
    direccion,
  });
  const nuevoContacto = await Contacto.create({
    personaAutorizada,
    correoElectronico,
    telefono,
    destinoId: destino.id,
  });
  const destinoConContacto = await Destino.findByPk(destino.id, {
    include: {
      model: Contacto,
      as: "contactos",
    },
  });
  res.status(200).json(destinoConContacto);
};
controller.createDestinoWithContacto = createDestinoWithContacto;

const updateDestino = async (req, res) => {
  const { pais, provincia, localidad, direccion } = req.body;
  const idDestino = req.params.id;
  const destino = await Destino.findByPk(idDestino);
  await destino.update({ pais, provincia, localidad, direccion });
  res.status(200).json(destino);
};
controller.updateDestino = updateDestino;

// Se elimina el destino marcándolo como inactivo, no se elimina de la base de datos.
const deleteDestino = async (req, res) => {
  const destinoId = req.params.id;
  const destino = await Destino.findByPk(destinoId);
  await destino.update({ activo: false });
  res.status(200).json({ message: "Destino eliminado." });
};
controller.deleteDestino = deleteDestino;

/* // Si se quiere eliminar de la base de datos, se puede usar este método
   //  pero es mejor usar un campo activo para no perder el historial de destinos.
const deleteDestino = async (req, res) => {
  const idDestino = req.params.id;
  const destino = await Destino.destroy({ where: { id: idDestino } });
  res.status(200).json({ message: "Destino eliminado correctamente" });
};
controller.deleteDestino = deleteDestino;
*/

module.exports = controller;
