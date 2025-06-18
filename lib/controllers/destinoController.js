const { where } = require("sequelize");
const { Destino, Contacto } = require("../models");
const controller = {};

const getDestino = async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 20;
  const offset = (page - 1) * limit;
  const { count, rows } = await Destino.findAndCountAll({
    where: { activo: true },
    include: { model: Contacto, as: "contactos" },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: rows,
  });
};
controller.getDestino = getDestino;

const getDestinoById = async (req, res) => {
  const id = req.params.id;
  const destinos = await Destino.findByPk(id, {
    include: { model: Contacto, as: "contactos" },
  });
  res.status(200).json(destinos);
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
  try {
    const { nombre, pais, provincia, localidad, direccion } = req.body;
    const nuevoDestino = await Destino.create({
      nombre,
      pais,
      provincia,
      localidad,
      direccion,
    });
    res.status(201).json(nuevoDestino);
  } catch (error) {
    console.error("Error al crear destino:", error);
    res
      .status(500)
      .json({ message: "Error al crear destino", error: error.message });
  }
};
controller.createDestino = createDestino;

const createDestinoWithContacto = async (req, res) => {
  try {
    const {
      nombre,
      pais,
      provincia,
      localidad,
      direccion,
      contactos,
    } = req.body;
    const destino = await Destino.create({
      nombre,
      pais,
      provincia,
      localidad,
      direccion,
    });

    if (Array.isArray(contactos) && contactos.length > 0) {
      await Promise.all(
        contactos.map((contacto) =>
          Contacto.create({ ...contacto, destinoId: destino.id })
        )
      );
    }

    const destinoConContacto = await Destino.findByPk(destino.id, {
      include: { model: Contacto, as: "contactos" },
    });
    res.status(201).json(destinoConContacto);
  } catch (error) {
    console.error("Error al crear destino con contacto:", error);
    res
      .status(500)
      .json({ message: "Error al crear destino", error: error.message });
  }
};
controller.createDestinoWithContacto = createDestinoWithContacto;

const addContactoToDestino = async (req, res) => {
  try {
    const idDestino = req.params.id;
    const nuevoContacto = req.body;
    const destino = await Destino.findByPk(idDestino);
    await destino.createContacto(nuevoContacto);
    const clienteActualizado = await Destino.findByPk(idDestino, {
      include: { model: Contacto, as: "contactos" },
    });
    return res.status(200).json(clienteActualizado);
  } catch (error) {
    console.error("Error en cargar contacto:", error);
    return res.status(500).json({ message: "Error al cargar contacto" });
  }
};
controller.addContactoToDestino = addContactoToDestino;

const updateDestino = async (req, res) => {
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
      return res.status(404).json({ message: "Destino no encontrado" });
    }

    await destino.update({ nombre, pais, provincia, localidad, direccion });

    if (contactos && Array.isArray(contactos)) {
      await Contacto.destroy({ where: { destinoId: idDestino } });

      if (contactos.length > 0) {
        await Promise.all(
          contactos.map((contacto) =>
            Contacto.create({ ...contacto, destinoId: idDestino })
          )
        );
      }
    }

    const destinoActualizado = await Destino.findByPk(idDestino, {
      include: { model: Contacto, as: "contactos" },
    });

    res.status(200).json(destinoActualizado);
  } catch (error) {
    console.error("Error al actualizar destino:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar destino", error: error.message });
  }
};
controller.updateDestino = updateDestino;

const activateDestino = async (req, res) => {
  const idDestino = req.params.id;
  const destino = await Destino.findByPk(idDestino);
  await destino.update({ activo: true });
  res.status(200).json(destino);
};
controller.activateDestino = activateDestino;

const deleteDestino = async (req, res) => {
  const idDestino = req.params.id;
  const destino = await Destino.findByPk(idDestino);
  await destino.update({ activo: false });
  res.status(200).json({ message: "Destino eliminado correctamente" });
};
controller.deleteDestino = deleteDestino;

module.exports = controller;
