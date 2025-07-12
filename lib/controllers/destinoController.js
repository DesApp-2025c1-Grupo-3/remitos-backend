const { where } = require("sequelize");
const { Destino, Contacto, sequelize } = require("../models");
const { message } = require("../schemas/estadoSchema");
const controller = {};

const getDestino = async (req, res) => {
  const destinos = await Destino.findAll({
    include: { model: Contacto, as: "contactos" },
  });
  res.status(200).json(destinos);
};
controller.getDestino = getDestino;

const getDestinoById = async (req, res) => {
  const id = req.params.id;
  const destino = await Destino.findByPk(id, {
    include: { model: Contacto, as: "contactos" },
  });
  res.status(200).json(destino);
};
controller.getDestinoById = getDestinoById;

const getDestinoFiltrado = async (req, res) => {
  const { pais, provincia, localidad } = req.query;
  const filtros = {};
  if (pais) filtros.pais = pais;
  if (provincia) filtros.provincia = provincia;
  if (localidad) filtros.localidad = localidad;
  const destinos = await Destino.findAll({ where: filtros });
  res.status(200).json(destinos);
};
controller.getDestinoFiltrado = getDestinoFiltrado;

const createDestino = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { contactos, ...destinoData } = req.body;

    const destino = await Destino.create(destinoData, { transaction: t });

    // Crear contactos si se proporcionan
    if (contactos && Array.isArray(contactos) && contactos.length > 0) {
      for (const contacto of contactos) {
        await Contacto.create(
          {
            ...contacto,
            destinoId: destino.id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Devolver destino con contactos
    const destinoConContactos = await Destino.findByPk(destino.id, {
      include: {
        model: Contacto,
        as: "contactos",
      },
    });

    res.status(201).json(destinoConContactos);
  } catch (error) {
    await t.rollback();
    console.error("Error al crear destino:", error);
    res.status(500).json({ message: "Error al crear el destino" });
  }
};
controller.createDestino = createDestino;

const createDestinoWithContacto = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      nombre,
      pais,
      provincia,
      localidad,
      direccion,
      contactos,
    } = req.body;

    const destino = await Destino.create(
      {
        nombre,
        pais,
        provincia,
        localidad,
        direccion,
      },
      { transaction: t }
    );

    // Crear contactos
    if (contactos && Array.isArray(contactos) && contactos.length > 0) {
      for (const contacto of contactos) {
        await Contacto.create(
          {
            ...contacto,
            destinoId: destino.id,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    const destinoConContacto = await Destino.findByPk(destino.id, {
      include: {
        model: Contacto,
        as: "contactos",
      },
    });
    res.status(201).json(destinoConContacto);
  } catch (error) {
    await t.rollback();
    console.error("Error al crear destino con contacto:", error);
    res.status(500).json({ message: "Error al crear el destino con contacto" });
  }
};
controller.createDestinoWithContacto = createDestinoWithContacto;

const updateDestino = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      nombre,
      pais,
      provincia,
      localidad,
      direccion,
      contactos,
    } = req.body;
    const idDestino = req.params.id;

    const destino = await Destino.findByPk(idDestino);
    if (!destino) {
      await t.rollback();
      return res.status(404).json({ message: "Destino no encontrado" });
    }

    await destino.update(
      {
        nombre,
        pais,
        provincia,
        localidad,
        direccion,
      },
      { transaction: t }
    );

    // Actualizar contactos si se proporcionan
    if (contactos && Array.isArray(contactos)) {
      // Eliminar contactos existentes
      await Contacto.destroy({
        where: { destinoId: idDestino },
        transaction: t,
      });

      // Crear nuevos contactos
      for (const contacto of contactos) {
        await Contacto.create(
          {
            ...contacto,
            destinoId: idDestino,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    const destinoActualizado = await Destino.findByPk(idDestino, {
      include: { model: Contacto, as: "contactos" },
    });

    res.status(200).json(destinoActualizado);
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar destino:", error);
    res.status(500).json({ message: "Error al actualizar el destino" });
  }
};
controller.updateDestino = updateDestino;

const deleteDestino = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const idDestino = req.params.id;

    // Eliminar contactos primero
    await Contacto.destroy({
      where: { destinoId: idDestino },
      transaction: t,
    });

    // Luego eliminar destino
    await Destino.destroy({
      where: { id: idDestino },
      transaction: t,
    });

    await t.commit();
    res.status(200).json({ message: "Destino eliminado correctamente" });
  } catch (error) {
    await t.rollback();
    console.error("Error al eliminar destino:", error);
    res.status(500).json({ message: "Error al eliminar el destino" });
  }
};
controller.deleteDestino = deleteDestino;

module.exports = controller;
