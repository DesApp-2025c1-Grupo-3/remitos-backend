const { where } = require("sequelize");
const { Cliente, Contacto, sequelize } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getCliente = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    // Filtros de búsqueda
    const where = {};
    if (req.query.razonSocial) {
      where.razonSocial = {
        [require("sequelize").Op.iLike]: `%${req.query.razonSocial}%`,
      };
    }
    if (req.query.cuit_rut) {
      where.cuit_rut = {
        [require("sequelize").Op.iLike]: `%${req.query.cuit_rut}%`,
      };
    }
    if (req.query.direccion) {
      where.direccion = {
        [require("sequelize").Op.iLike]: `%${req.query.direccion}%`,
      };
    }

    // Paso 1: obtener los IDs de los clientes paginados
    const { count, rows: clientesIds } = await Cliente.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ["updatedAt", "DESC"],
        ["id", "DESC"],
      ],
      attributes: ["id"],
    });

    // Paso 2: obtener los clientes completos con contactos
    const clientes = await Cliente.findAll({
      where: { id: clientesIds.map((c) => c.id) },
      include: {
        model: Contacto,
        as: "contactos",
      },
      order: [["updatedAt", "DESC"]],
    });

    // Mantener el orden original
    const clientesMap = new Map(clientes.map((c) => [c.id, c]));
    const clientesOrdenados = clientesIds.map((c) => clientesMap.get(c.id));

    // Desactivar caché HTTP
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");

    res.status(200).json({
      data: clientesOrdenados,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes" });
  }
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
      tipoEmpresaId,
      personaAutorizada,
      correoElectronico,
      telefono,
    } = req.body;

    const cliente = await Cliente.create(
      {
        razonSocial,
        cuit_rut,
        direccion,
        tipoEmpresaId,
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
    
    // Enviar respuesta después del commit exitoso
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    // Solo hacer rollback si la transacción no ha sido commitada
    if (!t.finished) {
      await t.rollback();
    }
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
