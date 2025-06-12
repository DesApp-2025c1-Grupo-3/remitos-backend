const { Cliente } = require("../models");
const { Contacto } = require("../models");
const cliente = require("../config/redis");
const controller = {};

const getCliente = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const cacheKey = `clientes:page:${page}:limit:${limit}`;

    const cacheCliente = await cliente.get(cacheKey);

    if (cacheCliente) {
      return res.status(200).json(JSON.parse(cacheCliente));
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Cliente.findAndCountAll({
      where: { activo: true },
      include: {
        model: Contacto,
        as: "contactos",
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const responseData = {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    };

    await cliente.set(cacheKey, JSON.stringify(responseData), "EX", 5000);

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error en getCliente:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al obtener clientes." });
  }
};
controller.getCliente = getCliente;

const getClienteById = async (req, res) => {
  const id = req.params.id;
  let clienteData;

  try {
    const cacheClienteId = await cliente.get(`cliente${id}`);

    if (cacheClienteId) {
      clienteData = JSON.parse(cacheClienteId);
    } else {
      const clienteDB = await Cliente.findByPk(id, {
        include: {
          model: Contacto,
          as: "contactos",
        },
      });

      clienteData = clienteDB;

      await cliente.set(
        `cliente${id}`,
        JSON.stringify(clienteData),
        "EX",
        5000
      );
    }

    return res.status(200).json(clienteData);
  } catch (error) {
    console.error("Error en getClienteById:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
controller.getClienteById = getClienteById;

const createCliente = async (req, res) => {
  try {
    const clienteNuevo = req.body;
    const nuevoCliente = await Cliente.create(clienteNuevo);

    await cliente.del(`clientes:*`);

    return res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error("Error en createCliente:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al crear cliente." });
  }
};
controller.createCliente = createCliente;

const createClienteWithContacto = async (req, res) => {
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

    const newCliente = await Cliente.create({
      razonSocial,
      cuit_rut,
      direccion,
      tipoEmpresa,
    });

    if (!newCliente) {
      return res.status(500).json({ message: "No se pudo crear el cliente." });
    }

    const nuevoContacto = await Contacto.create({
      personaAutorizada,
      correoElectronico,
      telefono,
      clienteId: newCliente.id,
    });

    const clienteConContactos = await Cliente.findByPk(newCliente.id, {
      include: {
        model: Contacto,
        as: "contactos",
      },
    });

    await cliente.del(`clientes:*`);

    return res.status(200).json(clienteConContactos);
  } catch (error) {
    console.error("Error en createClienteWithContacto:", error);
    return res
      .status(500)
      .json({
        message: "Error interno del servidor al crear cliente con contacto.",
      });
  }
};
controller.createClienteWithContacto = createClienteWithContacto;

const deleteCliente = async (req, res) => {
  try {
    const idCliente = req.params.id;
    const clienteToDelete = await Cliente.findByPk(idCliente);

    await clienteToDelete.update({ activo: false });

    await cliente.del(`cliente${idCliente}`);
    await cliente.del(`clientes:*`);

    return res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteCliente:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al eliminar cliente." });
  }
};
controller.deleteCliente = deleteCliente;

const activateCliente = async (req, res) => {
  try {
    const idCliente = req.params.id;
    const clienteToActivate = await Cliente.findByPk(idCliente);

    await clienteToActivate.update({ activo: true });

    await cliente.del(`cliente${idCliente}`);
    await cliente.del(`clientes:*`);

    return res.status(200).json(clienteToActivate);
  } catch (error) {
    console.error("Error en activateCliente:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al activar cliente." });
  }
};
controller.activateCliente = activateCliente;

const updateCliente = async (req, res) => {
  try {
    const idCliente = req.params.id;
    const { razonSocial, cuit_rut, direccion, tipoEmpresa } = req.body;
    const clienteToUpdate = await Cliente.findByPk(idCliente);

    await clienteToUpdate.update({
      razonSocial,
      cuit_rut,
      direccion,
      tipoEmpresa,
    });

    await cliente.del(`cliente${idCliente}`);
    await cliente.del(`clientes:*`);

    return res.status(200).json(clienteToUpdate);
  } catch (error) {
    console.error("Error en updateCliente:", error);
    return res
      .status(500)
      .json({ error: "Error del servidor al actualizar cliente." });
  }
};
controller.updateCliente = updateCliente;

module.exports = controller;
