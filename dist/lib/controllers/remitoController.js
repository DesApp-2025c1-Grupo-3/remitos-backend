const { Remito, Cliente, Destino, Contacto } = require("../models");

const { message } = require("../schemas/estadoSchema");

const controller = {};

const getRemitos = async (req, res) => {
  const remitos = await Remito.findAll();
  res.status(200).json(remitos);
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
    ],
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
    observaciones,
    archivoAdjunto,
  } = req.body;
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
    archivoAdjunto,
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
    archivoAdjunto,
    pais,
    provincia,
    localidad,
    direccionD,
    personaAutorizadaD,
    correoElectronicoD,
    telefonoD,
    razonSocial,
    direccionC,
    cuit_rut,
    tipoEmpresa,
    personaAutorizada,
    correoElectronico,
    telefono,
  } = req.body;
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
    archivoAdjunto,
  });
  const destino = await Destino.create({
    pais,
    provincia,
    localidad,
    direccionD,
  });
  const nuevoContactoDestino = await Contacto.create({
    personaAutorizadaD,
    correoElectronicoD,
    telefonoD,
    destinoId: destino.id,
  });
  const cliente = await Cliente.create({
    razonSocial,
    cuit_rut,
    direccionC,
    tipoEmpresa,
  });
  const nuevoContactoCliente = await Contacto.create({
    personaAutorizada,
    correoElectronico,
    telefono,
    clienteId: cliente.id,
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
    ],
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
    archivoAdjunto,
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
    archivoAdjunto,
  });
  res.status(200).json(remito);
};

controller.updateRemito = updateRemito;

const deleteRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.destroy();
  res.status(200).json({
    message: "Remito eliminado correctamente",
  });
};

controller.deleteRemito = deleteRemito;
module.exports = controller;
//# sourceMappingURL=remitoController.js.map
