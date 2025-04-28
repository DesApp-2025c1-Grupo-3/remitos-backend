const { includes } = require("lodash");

const { Estado } = require("../models");

const controller = {};

const getEstado = async (req, res) => {
  const estados = await Estado.findAll({});
  res.status(200).json(estados);
};

controller.getEstado = getEstado;

const getEstadoById = async (req, res) => {
  const id = req.params.id;
  const estado = await Estado.findByPk({
    id,
  });
  res.status(200).json(estado);
};

controller.getEstadoById = getEstadoById;

const createEstado = async (req, res) => {
  const estado = req.body;
  const nuevoEstado = await Estado.create(estado);
  res.status(201).json(nuevoEstado);
};

controller.createEstado = createEstado;

const updateEstado = async (req, res) => {
  const idEstado = req.params.id;
  const { descripcion } = req.body;
  const estado = await Estado.findByPk(idEstado);
  await estado.update({
    descripcion,
  });
  res.status(200).json(estado);
};

controller.updateEstado = updateEstado;

const deleteEstado = async (req, res) => {
  const idEstado = req.params.id;
  const estado = await Estado.destroy({
    where: {
      id: idEstado,
    },
  });
  res.status(200).json(estado);
};

controller.deleteEstado = deleteEstado;
module.exports = controller;
//# sourceMappingURL=estadoController.js.map
