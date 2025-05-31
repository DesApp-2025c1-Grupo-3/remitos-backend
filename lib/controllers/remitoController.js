const { includes } = require("lodash");
const { Remito, Cliente, Destino, Mercaderia, Estado } = require("../models");
const { message } = require("../schemas/estadoSchema");
const { off } = require("../app");
const controller = {};

const getRemitos = async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 20;
  const offset = (page - 1) * limit; // permite saltear los que son de paginas anteriores
  const { count, rows } = await Remito.findAndCountAll({
    where: { activo: true },
    include: [
      {
        model: Destino,
        as: "destino",
      },
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Estado,
        as: "estado",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]], //revisar atributo que toma para el orden
  });
  res.status(200).json({
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: rows,
  });
};
controller.getRemitos = getRemitos;

const getRemitoById = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id, {
    include: [
      {
        model: Destino,
        as: "destino",
      },
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Estado,
        as: "estado",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
  });
  res.status(200).json(remito);
};
controller.getRemitoById = getRemitoById;

const createRemito = async (req, res) => {
  const {
    numeroAsignado,
    observaciones,
    prioridad,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  } = req.body;
  const fechaEmision = new Date();
  const archivoEnviado = req.file?.path || null;
  const remito = await Remito.create({
    numeroAsignado,
    fechaEmision,
    observaciones,
    prioridad,
    archivoAdjunto: archivoEnviado,
  });
  const mercaderia = await Mercaderia.create({
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    remitosId: remito.id,
  });
  res.status(201).json(remito);
};
controller.createRemito = createRemito;

const createRemitoWithClienteAndDestino = async (req, res) => {
  const {
    numeroAsignado,
    observaciones,
    prioridad,
    clienteId,
    destinoId,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  } = req.body;
  const archivoEnviado = req.file?.path || null;
  const mercaderia = await Mercaderia.create({
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  });
  const fechaEmision = new Date();
  const remito = await Remito.create({
    numeroAsignado,
    fechaEmision,
    observaciones,
    prioridad,
    archivoAdjunto: archivoEnviado,
    clienteId,
    destinoId,
    mercaderiaId: mercaderia.id,
    estadoId: 1,
  });
  const remitoWithDestinoAndCliente = await Remito.findByPk(remito.id, {
    include: [
      {
        model: Destino,
        as: "destino",
      },
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
  });
  await mercaderia.update({ remitosId: remito.id }, { estadoId: 1 });
  res.status(201).json(remitoWithDestinoAndCliente);
};
controller.createRemitoWithClienteAndDestino = createRemitoWithClienteAndDestino;

//CONSULTAR SI VA PORQUE SOLO CAMBIA ESTADOS
const updateRemito = async (req, res) => {
  const idRemito = req.params.id;
  const { numeroAsignado, observaciones, archivoAdjunto, prioridad } = req.body;
  const remito = await Remito.findByPk(idRemito);
  await remito.update({
    numeroAsignado,
    observaciones,
    archivoAdjunto,
    prioridad,
  });
  res.status(200).json(remito);
};
controller.updateRemito = updateRemito;

const updateEstadoRemito = async (req, res) => {
  const remitoId = req.params.id;
  const estId = req.params.eid;
  const remito = await Remito.findByPk(remitoId);
  await remito.update({ estadoId: estId });
  const remitoActualizado = await Remito.findByPk(remitoId, {
    include: [
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Destino,
        as: "destino",
      },
      {
        model: Estado,
        as: "estado",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
  });
  res.status(200).json(remitoActualizado);
};
controller.updateEstadoRemito = updateEstadoRemito;

const deleteRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.update({ activo: false });
  res.status(200).json({ message: "Remito eliminado correctamente" });
};
controller.deleteRemito = deleteRemito;

const activateRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.update({ activo: true });
  res.status(200).json(remito);
};
controller.activateRemito = activateRemito;

module.exports = controller;
