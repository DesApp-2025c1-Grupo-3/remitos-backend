const { where } = require("sequelize");
const { Cliente, Contacto, sequelize } = require("../models");
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
  const t = await sequelize.transaction();

  try {
    const { contactos, ...clienteData } = req.body;

    const cliente = await Cliente.create(clienteData, { transaction: t });

    // Crear contactos si se proporcionan
    if (contactos && Array.isArray(contactos) && contactos.length > 0) {
      for (const contacto of contactos) {
        await Contacto.create(
          {
            ...contacto,
            clienteId: cliente.id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Devolver cliente con contactos
    const clienteConContactos = await Cliente.findByPk(cliente.id, {
      include: {
        model: Contacto,
        as: "contactos",
      },
    });

    res.status(201).json(clienteConContactos);
  } catch (error) {
    await t.rollback();
    console.error("Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear el cliente" });
  }
};
controller.createCliente = createCliente;

const createClienteWithContacto = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      razonSocial,
      cuit_rut,
      direccion,
      tipoEmpresa,
      personaAutorizada,
      correoElectronico,
      telefono,
    } = req.body;

    const cliente = await Cliente.create(
      {
        razonSocial,
        cuit_rut,
        direccion,
        tipoEmpresa,
      },
      { transaction: t }
    );

    const nuevoContacto = await Contacto.create(
      {
        personaAutorizada,
        correoElectronico,
        telefono,
        clienteId: cliente.id,
      },
      { transaction: t }
    );

    await t.commit();

    const clienteConContactos = await Cliente.findByPk(cliente.id, {
      include: {
        model: Contacto,
        as: "contactos",
      },
    });
    res.status(201).json(clienteConContactos);
  } catch (error) {
    await t.rollback();
    console.error("Error al crear cliente con contacto:", error);
    res.status(500).json({ message: "Error al crear el cliente con contacto" });
  }
};
controller.createClienteWithContacto = createClienteWithContacto;

const deleteCliente = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const idCliente = req.params.id;

    // Eliminar contactos primero
    await Contacto.destroy({
      where: { clienteId: idCliente },
      transaction: t,
    });

    // Luego eliminar cliente
    await Cliente.destroy({
      where: { id: idCliente },
      transaction: t,
    });

    await t.commit();
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    await t.rollback();
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar el cliente" });
  }
};
controller.deleteCliente = deleteCliente;

const updateCliente = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const idCliente = req.params.id;
    const { contactos, ...clienteData } = req.body;

    const cliente = await Cliente.findByPk(idCliente);
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await cliente.update(clienteData, { transaction: t });

    // Actualizar contactos si se proporcionan
    if (contactos && Array.isArray(contactos)) {
      // Eliminar contactos existentes
      await Contacto.destroy({
        where: { clienteId: idCliente },
        transaction: t,
      });

      // Crear nuevos contactos
      for (const contacto of contactos) {
        await Contacto.create(
          {
            ...contacto,
            clienteId: idCliente,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Devolver cliente actualizado con contactos
    const clienteActualizado = await Cliente.findByPk(idCliente, {
      include: {
        model: Contacto,
        as: "contactos",
      },
    });

    res.status(200).json(clienteActualizado);
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};
controller.updateCliente = updateCliente;

module.exports = controller;
