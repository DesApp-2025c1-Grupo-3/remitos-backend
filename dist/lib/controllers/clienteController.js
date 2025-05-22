const {
  where
} = require("sequelize");

const {
  Cliente
} = require("../models");

const {
  Contacto
} = require("../models");

const {
  message
} = require("../schemas/estadoSchema");

const controller = {};

const getCliente = async (req, res) => {
  const clientes = await Cliente.findAll({
    include: {
      model: Contacto,
      as: "contactos"
    }
  });
  res.status(200).json(clientes);
};

controller.getCliente = getCliente;

const getClienteById = async (req, res) => {
  const id = req.params.id;
  const cliente = await Cliente.findByPk(id, {
    include: {
      model: Contacto,
      as: "contactos"
    }
  });
  res.status(200).json(cliente);
};

controller.getClienteById = getClienteById;

const createCliente = async (req, res) => {
  const cliente = req.body;
  const nuevoCliente = await Cliente.create(cliente);
  res.status(201).json(nuevoCliente);
};

controller.createCliente = createCliente;

const createClienteWithContacto = async (req, res) => {
  const {
    razonSocial,
    cuit_rut,
    direccion,
    tipoEmpresa,
    personaAutorizada,
    correoElectronico,
    telefono
  } = req.body;
  const cliente = await Cliente.create({
    razonSocial,
    cuit_rut,
    direccion,
    tipoEmpresa
  });
  const nuevoContacto = await Contacto.create({
    personaAutorizada,
    correoElectronico,
    telefono,
    clienteId: cliente.id
  });
  const clienteConContactos = await Cliente.findByPk(cliente.id, {
    include: {
      model: Contacto,
      as: "contactos"
    }
  });
  res.status(200).json(clienteConContactos);
};

controller.createClienteWithContacto = createClienteWithContacto;

const deleteCliente = async (req, res) => {
  const idCliente = req.params.id;
  const cliente = await Cliente.destroy({
    where: {
      id: idCliente
    }
  });
  res.status(200).json({
    message: "Cliente eliminado correctamente"
  });
};

controller.deleteCliente = deleteCliente;

const updateCliente = async (req, res) => {
  const idCliente = req.params.id;
  const {
    razonSocial,
    cuit_rut,
    direccion,
    tipoEmpresa
  } = req.body;
  const cliente = await Cliente.findByPk(idCliente);
  await cliente.update({
    razonSocial,
    cuit_rut,
    direccion,
    tipoEmpresa
  });
  res.status(200).json(cliente);
};

controller.updateCliente = updateCliente;
module.exports = controller;
//# sourceMappingURL=clienteController.js.map