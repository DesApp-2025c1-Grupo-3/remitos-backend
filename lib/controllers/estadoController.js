const Estado = require("../models/estado");
const controller = {};

const getEstado = async (req, res) => {
  const estados = await Estado.getAll({});
  res.status(200).json(estados);
};
controller.getEstado = getEstado;

const getEstadoById = async (req, res) => {
  const id = req.params.id;
  const estado = await Estado.findByPk({ id });
  res.status(200).json(estado);
};
controller.getEstadoById = getEstadoById;

const createEstado = async (req, res) => {
  const estado = req.body;
  const nuevoEstado = await Estado.create({ estado });
  res.status(201).json(nuevoEstado);
};

controller.createEstado = createEstado;

module.exports = controller;
