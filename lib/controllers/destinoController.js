const { where } = require("sequelize");
const { Destino, Contacto } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getDestino = async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 20;
  const offset = (page - 1) * limit; // permite saltear los que son de paginas anteriores
  const { count, rows } = await Destino.findAndCountAll({
    where: { activo: true },
    include: { model: Contacto, as: "contactos" },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: rows,
  });
};
controller.getDestino = getDestino;

const getDestinoById = async (req, res) => {
  const id = req.params.id;
  const destinos = await Destino.findByPk(id, {
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
    nombre,
    pais,
    provincia,
    localidad,
    direccion,
    personaAutorizada,
    correoElectronico,
    telefono,
  } = req.body;
  const destino = await Destino.create({
    nombre,
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

const activateDestino = async (req, res) => {
  const idDestino = req.params.id;
  const destino = await Destino.findByPk(idDestino);
  await destino.update({ activo: true });
  res.status(200).json(destino);
};
controller.activateDestino = activateDestino;

const deleteDestino = async (req, res) => {
  const idDestino = req.params.id;
  const destino = await Destino.findByPk(idDestino);
  await destino.update({ activo: false });
  res.status(200).json({ message: "Destino eliminado correctamente" });
};
controller.deleteDestino = deleteDestino;

module.exports = controller;
