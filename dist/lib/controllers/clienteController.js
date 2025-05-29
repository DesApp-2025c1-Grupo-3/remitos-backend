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
    where: {
      activo: true
    },
    // Solo trae clientes activos
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

controller.updateCliente = updateCliente; // Se elimina el cliente marcándolo como inactivo, no se elimina de la base de datos.

const deleteCliente = async (req, res) => {
  const clienteId = req.params.id;
  const cliente = await Cliente.findByPk(clienteId);
  await cliente.update({
    activo: false
  });
  res.status(200).json({
    message: "Cliente eliminado."
  });
};

controller.deleteCliente = deleteCliente;
/* // Si se quiere eliminar de la base de datos, se puede usar este método
   //  pero es mejor usar un campo activo para no perder el historial de clientes.
const deleteCliente = async (req, res) => {
  const idCliente = req.params.id;
  const cliente = await Cliente.destroy({ where: { id: idCliente } });
  res.status(200).json({ message: "Cliente eliminado correctamente" });
};
controller.deleteCliente = deleteCliente;
*/

module.exports = controller;
//# sourceMappingURL=clienteController.js.map