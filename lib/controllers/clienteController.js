const { where } = require("sequelize");
const { Cliente } = require("../models");
const { Contacto } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getCliente = async (req, res) => {
  const clientes = await Cliente.findAll({
    include: {
      model: Contacto,
      as: "contactos",
    },
  });
  res.status(200).json(clientes);
};
controller.getCliente = getCliente;

const getClienteById = async (req, res) => {
  const id = req.params.id;
  const cliente = await Cliente.findByPk(id, {
    include: {
      model: Contacto,
      as: "contactos",
    },
  });
  res.status(200).json(cliente);
};
controller.getClienteById = getClienteById;

const createCliente = async (req, res) => {
  const cliente = req.body;
  const nuevoCliente = await Cliente.create(cliente);
  res.status(201).json({ message: "Cliente Creado", nuevoCliente });
};

controller.createCliente = createCliente;


const createClienteWithContacto = async (req, res) => {
  try {
    const { cliente, contacto } = req.body;

    // Crear cliente
    const nuevoCliente = await Cliente.create({
      razonSocial: cliente.razonSocial,
      cuit_rut: cliente.cuit_rut,
      direccion: cliente.direccion,
      tipoEmpresa: cliente.tipoEmpresa
    });

    // Crear contacto asociado
    const nuevoContacto = await Contacto.create({
      personaAutorizada: contacto.personaAutorizada,
      correoElectronico: contacto.correoElectronico,
      telefono: contacto.telefono,
      clienteId: nuevoCliente.id // FK
    });

    // Traer el cliente con su contacto para responder
    const clienteConContacto = await Cliente.findByPk(nuevoCliente.id, {
      include: { model: Contacto, as: 'contactos' } // Asegurate de que el alias 'contactos' esté bien definido en la asociación
    });

    res.status(201).json({
      message: 'Cliente creado con contacto asociado',
      cliente: clienteConContacto
    });
  } catch (error) {
    console.error('Error al crear cliente con contacto:', error);
    res.status(500).json({ error: 'Ocurrió un error al crear el cliente y el contacto' });
  }
};

controller.createClienteWithContacto = createClienteWithContacto;

const updateCliente = async (req, res) => {
  const idCliente = req.params.id;
  const { razonSocial, cuit_rut, direccion, tipoEmpresa } = req.body;
  const cliente = await Cliente.findByPk(idCliente);
  await cliente.update({ razonSocial, cuit_rut, direccion, tipoEmpresa });
  res.status(200).json(cliente);
};
controller.updateCliente = updateCliente;

// Se elimina el cliente marcándolo como inactivo, no se elimina de la base de datos.
const deleteCliente = async (req, res) => {
  const clienteId = req.params.id;
  const cliente = await Cliente.findByPk(clienteId);
  await cliente.update({ activo: false }); 
  res.status(200).json({ message: "Cliente eliminado.", cliente });
}
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
