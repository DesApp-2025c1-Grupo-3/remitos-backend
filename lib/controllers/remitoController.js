const { includes } = require("lodash");
const { Remito, Cliente, Destino, Mercaderia, Estado } = require("../models");
const { message } = require("../schemas/estadoSchema");
const { off } = require("../app");
const controller = {};

const getRemitos = async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 20;
  const offset = (page - 1) * limit; // permite saltear los que son de paginas anteriores
  const { count, rows } = await Remito.findAndCountAll({
    where: { activo: true },
    include: [
      {
        model: Destino,
        as: "destino",
      },
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Estado,
        as: "estado",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]], //revisar atributo que toma para el orden
  });
  res.status(200).json({
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: rows,
  });
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
      {
        model: Estado,
        as: "estado",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
  });
  res.status(200).json(remito);
};
controller.getRemitoById = getRemitoById;

const createRemito = async (req, res) => {
  const {
    numeroAsignado,
    observaciones,
    prioridad,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  } = req.body;
  const fechaEmision = new Date();
  const archivoEnviado = req.file?.path || null;

  // ✅ Crear mercadería primero
  const mercaderia = await Mercaderia.create({
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  });

  // ✅ Crear remito con referencia a mercadería
  const remito = await Remito.create({
    numeroAsignado,
    fechaEmision,
    observaciones,
    prioridad,
    archivoAdjunto: archivoEnviado,
    mercaderiaId: mercaderia.id,
  });

  res.status(201).json(remito);
};
controller.createRemito = createRemito;

const createRemitoWithClienteAndDestino = async (req, res) => {
  const {
    numeroAsignado,
    observaciones,
    prioridad,
    clienteId,
    destinoId,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  } = req.body;
  const archivoEnviado = req.file?.path || null;

  // ✅ Crear mercadería primero
  const mercaderia = await Mercaderia.create({
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  });

  const fechaEmision = new Date();

  // ✅ Crear remito con referencia a mercadería
  const remito = await Remito.create({
    numeroAsignado,
    fechaEmision,
    observaciones,
    prioridad,
    archivoAdjunto: archivoEnviado,
    clienteId,
    destinoId,
    mercaderiaId: mercaderia.id,
    estadoId: 1,
  });

  // ✅ Obtener remito completo con relaciones
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
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
  });

  res.status(201).json(remitoWithDestinoAndCliente);
};
controller.createRemitoWithClienteAndDestino = createRemitoWithClienteAndDestino;

//Actualiza los campos básicos del remito incluyendo cliente y destino
const updateRemito = async (req, res) => {
  const idRemito = req.params.id;
  const {
    numeroAsignado,
    observaciones,
    archivoAdjunto,
    prioridad,
    clienteId,
    destinoId,
  } = req.body;

  try {
    const remito = await Remito.findByPk(idRemito);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }

    // Preparar datos para actualizar
    const updateData = {
      numeroAsignado,
      observaciones,
      prioridad,
    };

    // Solo incluir campos opcionales si vienen en la request
    if (archivoAdjunto !== undefined) {
      updateData.archivoAdjunto = archivoAdjunto;
    }
    if (clienteId !== undefined) {
      updateData.clienteId = clienteId;
    }
    if (destinoId !== undefined) {
      updateData.destinoId = destinoId;
    }

    await remito.update(updateData);

    // Retornar remito actualizado con relaciones
    const remitoActualizado = await Remito.findByPk(idRemito, {
      include: [
        {
          model: Cliente,
          as: "cliente",
        },
        {
          model: Destino,
          as: "destino",
        },
        {
          model: Estado,
          as: "estado",
        },
        {
          model: Mercaderia,
          as: "mercaderia",
        },
      ],
    });

    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error("Error al actualizar remito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
controller.updateRemito = updateRemito;

const updateEstadoRemito = async (req, res) => {
  const remitoId = req.params.id;
  const estId = req.params.eid;
  const remito = await Remito.findByPk(remitoId);
  await remito.update({ estadoId: estId });
  const remitoActualizado = await Remito.findByPk(remitoId, {
    include: [
      {
        model: Cliente,
        as: "cliente",
      },
      {
        model: Destino,
        as: "destino",
      },
      {
        model: Estado,
        as: "estado",
      },
      {
        model: Mercaderia,
        as: "mercaderia",
      },
    ],
  });
  res.status(200).json(remitoActualizado);
};
controller.updateEstadoRemito = updateEstadoRemito;

const deleteRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.update({ activo: false });
  res.status(200).json({ message: "Remito eliminado correctamente" });
};
controller.deleteRemito = deleteRemito;

const activateRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.update({ activo: true });
  res.status(200).json(remito);
};
controller.activateRemito = activateRemito;

const updateMercaderia = async (req, res) => {
  const remitoId = req.params.id;
  const {
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
  } = req.body;

  try {
    // Buscar el remito y su mercadería asociada
    const remito = await Remito.findByPk(remitoId);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }

    const mercaderia = await Mercaderia.findByPk(remito.mercaderiaId);
    if (!mercaderia) {
      return res.status(404).json({ message: "Mercadería no encontrada" });
    }

    // Actualizar mercadería
    await mercaderia.update({
      tipoMercaderia,
      valorDeclarado,
      volumenMetrosCubico,
      pesoMercaderia,
      cantidadBobinas,
      cantidadRacks,
      cantidadBultos,
      cantidadPallets,
      requisitosEspeciales,
    });

    // Retornar la mercadería actualizada
    res.status(200).json(mercaderia);
  } catch (error) {
    console.error("Error al actualizar mercadería:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
controller.updateMercaderia = updateMercaderia;

module.exports = controller;
