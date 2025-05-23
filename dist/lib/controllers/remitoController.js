const {
  includes
} = require("lodash");

const {
  Remito,
  Cliente,
  Destino,
  Contacto,
  Estado
} = require("../models");

const {
  message
} = require("../schemas/estadoSchema");

const controller = {};

const getRemitos = async (req, res) => {
  const remitos = await Remito.findAll({
    include: [{
      model: Destino,
      as: "destino"
    }, {
      model: Cliente,
      as: "cliente"
    }, {
      model: Estado,
      as: "estado"
    }]
  });
  res.status(200).json(remitos);
};

controller.getRemitos = getRemitos;

const getRemitoById = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id, {
    include: [{
      model: Destino,
      as: "destino"
    }, {
      model: Cliente,
      as: "cliente"
    }, {
      model: Estado,
      as: "estado"
    }]
  });
  res.status(200).json(remito);
};

controller.getRemitoById = getRemitoById;

const createRemito = async (req, res) => {
  const {
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones
  } = req.body;
  const fechaEmision = new Date();
  const archivoEnviado = req.file?.path || null;
  const remito = await Remito.create({
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    fechaEmision,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    archivoAdjunto: archivoEnviado
  });
  res.status(201).json(remito);
};

controller.createRemito = createRemito;

const createRemitoWithClienteAndDestino = async (req, res) => {
  const {
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    clienteId,
    destinoId
  } = req.body;
  const archivoEnviado = req.file?.path || null;
  const fechaEmision = new Date();
  const remito = await Remito.create({
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    fechaEmision,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    archivoAdjunto: archivoEnviado,
    clienteId,
    destinoId,
    estadoId: 1
  });
  const remitoWithDestinoAndCliente = await Remito.findByPk(remito.id, {
    include: [{
      model: Destino,
      as: "destino"
    }, {
      model: Cliente,
      as: "cliente"
    }]
  });
  res.status(201).json(remitoWithDestinoAndCliente);
};

controller.createRemitoWithClienteAndDestino = createRemitoWithClienteAndDestino;

const updateRemito = async (req, res) => {
  const idRemito = req.params.id;
  const {
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    fechaEmision,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    archivoAdjunto
  } = req.body;
  const remito = await Remito.findByPk(idRemito);
  await remito.update({
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    fechaEmision,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    archivoAdjunto
  });
  res.status(200).json(remito);
};

controller.updateRemito = updateRemito;

const updateEstadoRemito = async (req, res) => {
  const remitoId = req.params.id;
  const estId = req.params.eid;
  const remito = await Remito.findByPk(remitoId);
  await remito.update({
    estadoId: estId
  });
  const remitoActualizado = await Remito.findByPk(remitoId, {
    include: [{
      model: Cliente,
      as: "cliente"
    }, {
      model: Destino,
      as: "destino"
    }, {
      model: Estado,
      as: "estado"
    }]
  });
  res.status(200).json(remitoActualizado);
};

controller.updateEstadoRemito = updateEstadoRemito;

const deleteRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.destroy();
  res.status(200).json({
    message: "Remito eliminado correctamente"
  });
};

controller.deleteRemito = deleteRemito;
module.exports = controller;
//# sourceMappingURL=remitoController.js.map