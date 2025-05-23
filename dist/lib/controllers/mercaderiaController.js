const { includes } = require("lodash");

const { Remito, Estado, Mercaderia } = require("../models");

const controller = {};

const getMercaderia = async (req, res) => {
  const mercaderia = await Mercaderia.findAll({
    include: {
      model: Estado,
      as: "estado",
    },
  });
  res.status(200).json(mercaderia);
};

controller.getMercaderia = getMercaderia;

const getMercaderiaById = async (req, res) => {
  const id = req.params.id;
  const mercaderia = await Mercaderia.findAll(id, {
    include: {
      model: Estado,
      as: "estado",
    },
  });
  res.status(200).json(mercaderia);
};

controller.getMercaderiaById = getMercaderiaById;

const updateMercaderia = async (req, res) => {
  const {
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    activo,
    remitosId,
    estadoId,
  } = req.body;
  const idMercaderia = req.params.id;
  const mercaderia = await Mercaderia.findByPk(idMercaderia);
  await mercaderia.update({
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    activo,
    remitosId,
    estadoId,
  });
  res.status(200).json(mercaderia);
};

controller.updateMercaderia = updateMercaderia;

const createMercaderia = async (req, res) => {
  const {
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    activo,
    remitosId,
    estadoId,
  } = req.body;
  const mercaderia = await Mercaderia.create(
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    activo,
    remitosId,
    estadoId
  );
  res.status(201).json(mercaderia);
};

controller.createMercaderia = createMercaderia;
module.exports = controller;
//# sourceMappingURL=mercaderiaController.js.map
