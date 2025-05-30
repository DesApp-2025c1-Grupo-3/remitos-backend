const {
  includes,
  isNull
} = require("lodash");

const {
  Estado
} = require("../models");

const {
  message
} = require("../schemas/estadoSchema");

const controller = {};

const getEstado = async (req, res) => {
  const estados = await Estado.findAll({
    where: {
      activo: true
    } //Solo trae estados activos
    // order: [["descripcion", "ASC"]], // Ordena por descripcion ascendente

  });
  res.status(200).json(estados);
};

controller.getEstado = getEstado;

const getEstadoById = async (req, res) => {
  const id = req.params.id;
  const estado = await Estado.findByPk(id);
  res.status(200).json(estado);
};

controller.getEstadoById = getEstadoById; // Este crea al estado con "activo" y "descripcion"

const createEstado = async (req, res) => {
  const estado = req.body;
  const estadoNuevo = await Estado.create(estado);
  res.status(201).json({
    message: "Estado Creado",
    estadoNuevo
  });
};

controller.createEstado = createEstado;
/*
// Crea un nuevo estado en la base de datos sin "activo"
const createEstado = async (req, res) => {
  const estado = req.body;
  const nuevoEstado = await Estado.create(estado);
  res.status(201).json(nuevoEstado);
};
controller.createEstado = createEstado;
*/

const updateEstado = async (req, res) => {
  const idEstado = req.params.id;
  const estadoActualizado = req.body;
  const estado = await Estado.findByPk(idEstado);
  await estado.update(estadoActualizado);
  res.status(200).json({
    message: "Estado Actualizado",
    estado
  });
};

controller.updateEstado = updateEstado; // Se elimina el estado marcándolo como inactivo, no se elimina de la base de datos.

const deleteEstado = async (req, res) => {
  const estadoId = req.params.id;
  const estado = await Estado.findByPk(estadoId);
  await estado.update({
    activo: false
  });
  res.status(200).json({
    message: "Estado Eliminado",
    estado
  });
};

controller.deleteEstado = deleteEstado;
/*
 // Si se quiere eliminar de la base de datos, se puede usar este método
 //  pero es mejor usar un campo activo para no perder el historial de estados.
const deleteEstado = async (req, res) => {
  const idEstado = req.params.id;
  const estado = await Estado.destroy({ where: { id: idEstado } });
  res.status(200).json(estado);
};
controller.deleteEstado = deleteEstado; 
*/

module.exports = controller;
//# sourceMappingURL=estadoController.js.map