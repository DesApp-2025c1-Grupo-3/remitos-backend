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
  const destino = await Destino.findByPk(id, {
    include: { model: Contacto, as: "contactos" },
  });
  res.status(200).json(destino);
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
  const { nombre, pais, provincia, localidad, direccion, contactos } = req.body;
  const destino = await Destino.create({
    nombre,
    pais,
    provincia,
    localidad,
    direccion,
  });

  for (const contacto of contactos) {
    await Contacto.create({
      ...contacto,
      destinoId: destino.id,
    });
  }

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
  const { nombre, pais, provincia, localidad, direccion, contactos } = req.body;
  const idDestino = req.params.id;

  const destino = await Destino.findByPk(idDestino);
  if (destino) {
    await destino.update({ nombre, pais, provincia, localidad, direccion });

    await Contacto.destroy({ where: { destinoId: idDestino } });

    for (const contacto of contactos) {
      await Contacto.create({
        ...contacto,
        destinoId: idDestino,
      });
    }
  }

  const destinoActualizado = await Destino.findByPk(idDestino, {
    include: { model: Contacto, as: "contactos" },
  });

  res.status(200).json(destinoActualizado);
};
controller.updateDestino = updateDestino;

const deleteDestino = async (req, res) => {
  const idDestino = req.params.id;
  await Contacto.destroy({ where: { destinoId: idDestino } });
  await Destino.destroy({ where: { id: idDestino } });
  res.status(200).json({ message: "Destino eliminado correctamente" });
};
controller.deleteDestino = deleteDestino;

module.exports = controller;
