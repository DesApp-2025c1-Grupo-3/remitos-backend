const {
  where
} = require("sequelize");

const {
  Destino,
  Contacto
} = require("../models");

const controller = {};

const {
  message
} = require("../schemas/destinoSchema");

const getDestino = async (req, res) => {
  const destinos = await Destino.findAll({
    where: {
      activo: true
    },
    include: {
      model: Contacto,
      as: "contactos"
    }
  });
  res.status(200).json(destinos);
};

controller.getDestino = getDestino;

const getDestinoById = async (req, res) => {
  const destinoId = req.params.id;
  const destino = await Destino.findByPk(destinoId, {
    include: {
      model: Contacto,
      as: "contactos"
    }
  });
  res.status(200).json(destino);
};

controller.getDestinoById = getDestinoById;

const getDestinoFiltrado = async (req, res) => {
  const {
    name,
    pais,
    provincia,
    localidad
  } = req.query;
  const filtros = {}; //Solo permite letras y espacios

  if (name) filtros.name = name;
  if (pais) filtros.pais = pais;
  if (provincia) filtros.provincia = provincia;
  if (localidad) filtros.localidad = localidad;
  filtros.activo = true; // Solo destinos activos

  const destinos = await Destino.findAll({
    where: filtros
  });

  if (!destinos || destinos.length === 0) {
    return res.status(404).json({
      message: "No se encontraron destinos con los filtros proporcionados."
    });
  }

  res.status(200).json(destinos);
};

controller.getDestinoFiltrado = getDestinoFiltrado;

const createDestino = async (req, res) => {
  //Ver si es necesario dividir, en calle y altura, la dirección
  const destino = req.body;
  const nuevoDestino = await Destino.create(destino);
  res.status(201).json({
    message: "Destino Creado",
    nuevoDestino
  });
};

controller.createDestino = createDestino;

const createDestinoWithContacto = async (req, res) => {
  const {
    name,
    pais,
    provincia,
    localidad,
    direccion,
    personaAutorizada,
    correoElectronico,
    telefono
  } = req.body; // Primero creo el destino

  const destinoNuevo = await Destino.create({
    name,
    pais,
    provincia,
    localidad,
    direccion
  }); // Luego creo el contacto asociado

  const nuevoContacto = await Contacto.create({
    personaAutorizada,
    correoElectronico,
    telefono,
    destinoId: destinoNuevo.id
  }); // Traigo el destino con contactos para responder

  const destinoConContacto = await Destino.findByPk(destinoNuevo.id, {
    include: {
      model: Contacto,
      as: "contactos"
    }
  });
  res.status(201).json({
    message: "Destino Creado con contacto",
    destino: destinoConContacto
  });
};

controller.createDestinoWithContacto = createDestinoWithContacto;

const updateDestino = async (req, res) => {
  const {
    name,
    pais,
    provincia,
    localidad,
    direccion
  } = req.body;
  const idDestino = req.params.id;
  const destino = await Destino.findByPk(idDestino);
  await destino.update({
    name,
    pais,
    provincia,
    localidad,
    direccion
  });
  res.status(200).json({
    message: "Destino Actualizado",
    destino
  });
};

controller.updateDestino = updateDestino; // Se elimina el destino marcándolo como inactivo, no se elimina de la base de datos.

const deleteDestino = async (req, res) => {
  const destinoId = req.params.id;
  const destino = await Destino.findByPk(destinoId);
  await destino.update({
    activo: false
  });
  res.status(200).json({
    message: "Destino Eliminado",
    destino
  });
};

controller.deleteDestino = deleteDestino;
module.exports = controller;
//# sourceMappingURL=destinoController.js.map