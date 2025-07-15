const { includes } = require("lodash");

const {
  Remito,
  Cliente,
  Destino,
  Contacto,
  Estado,
  Mercaderia,
  sequelize,
} = require("../models");

const { message } = require("../schemas/estadoSchema");

const { Op } = require("sequelize");

const controller = {};

const getRemitos = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit; // Filtros

    const where = {};

    if (req.query.numeroAsignado) {
      where.numeroAsignado = {
        [Op.iLike]: `%${req.query.numeroAsignado}%`,
      };
    }

    if (req.query.clienteId) {
      where.clienteId = req.query.clienteId;
    }

    if (req.query.destinoId) {
      where.destinoId = req.query.destinoId;
    }

    if (req.query.estadoId) {
      where.estadoId = req.query.estadoId;
    }

    if (req.query.prioridad) {
      where.prioridad = req.query.prioridad;
    }

    if (req.query.fechaEmision) {
      // Buscar por fecha específica (formato YYYY-MM-DD)
      const [year, month, day] = req.query.fechaEmision.split("-").map(Number);
      const fechaInicio = new Date(year, month - 1, day, 0, 0, 0, 0);
      const fechaFin = new Date(year, month - 1, day, 23, 59, 59, 999);
      where.fechaEmision = {
        [Op.gte]: fechaInicio,
        [Op.lte]: fechaFin,
      };
    }

    const { count, rows } = await Remito.findAndCountAll({
      where,
      limit,
      offset,
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
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener remitos:", error);
    res.status(500).json({
      message: "Error al obtener los remitos",
    });
  }
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
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    razonNoEntrega,
  } = req.body;
  const fechaEmision = new Date();
  const archivoEnviado = req.file?.path || null;
  const remito = await Remito.create({
    numeroAsignado,
    tipoMercaderia,
    valorDeclarado,
    volumenMetrosCubico,
    pesoMercaderia,
    fechaEmision,
    cantidadBobinas,
    cantidadRacks,
    cantidadBultos,
    cantidadPallets,
    requisitosEspeciales,
    observaciones,
    archivoAdjunto: archivoEnviado,
    razonNoEntrega,
  });
  res.status(201).json(remito);
};

controller.createRemito = createRemito;

const createRemitoWithClienteAndDestino = async (req, res) => {
  const t = await sequelize.transaction(); // Iniciar transacción

  try {
    const {
      numeroAsignado,
      fechaEmision,
      observaciones,
      clienteId,
      destinoId,
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
    } = req.body; // Función para convertir valores a enteros para campos BIGINT

    const convertToInteger = (value) => {
      if (value === null || value === undefined || value === "") return null;
      const numValue = parseFloat(value);
      return isNaN(numValue) ? null : Math.floor(numValue);
    }; // Convertir valores numéricos a enteros

    const mercaderiaData = {
      tipoMercaderia,
      valorDeclarado: convertToInteger(valorDeclarado),
      volumenMetrosCubico: convertToInteger(volumenMetrosCubico),
      pesoMercaderia: convertToInteger(pesoMercaderia),
      cantidadBobinas: convertToInteger(cantidadBobinas),
      cantidadRacks: convertToInteger(cantidadRacks),
      cantidadBultos: convertToInteger(cantidadBultos),
      cantidadPallets: convertToInteger(cantidadPallets),
      requisitosEspeciales,
    }; // 1. Crear Mercaderia dentro de la transacción

    const nuevaMercaderia = await Mercaderia.create(mercaderiaData, {
      transaction: t,
    }); // 2. Crear Remito dentro de la transacción

    const nuevoRemito = await Remito.create(
      {
        numeroAsignado,
        fechaEmision,
        observaciones,
        prioridad,
        clienteId,
        destinoId,
        mercaderiaId: nuevaMercaderia.id,
        estadoId: 1,
        archivoAdjunto: req.file?.path || null,
        razonNoEntrega: req.body.razonNoEntrega,
      },
      {
        transaction: t,
      }
    ); // Si todo va bien, confirmar la transacción

    await t.commit(); // Devolver el remito completo con sus relaciones

    const remitoCompleto = await Remito.findByPk(nuevoRemito.id, {
      include: ["cliente", "destino", "estado", "mercaderia"],
    });
    res.status(201).json(remitoCompleto);
  } catch (error) {
    // Si algo falla, revertir la transacción
    await t.rollback();
    console.error(
      "Error al crear remito con mercaderia (transacción revertida):",
      error
    );
    res.status(500).json({
      message: "Error al crear el remito",
    });
  }
};

controller.createRemitoWithClienteAndDestino = createRemitoWithClienteAndDestino;

const updateRemito = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log("--- Iniciando actualización de Remito ---");
  console.log("ID del Remito:", id);
  console.log("Datos recibidos (req.body):", data);

  try {
    const remito = await Remito.findByPk(id);

    if (!remito) {
      console.log("Error: Remito no encontrado.");
      return res.status(404).json({
        message: "Remito no encontrado",
      });
    }

    console.log(
      "Remito encontrado. ID de mercadería asociada:",
      remito.mercaderiaId
    ); // Definir los campos que pertenecen a cada modelo

    const remitoFields = [
      "numeroAsignado",
      "fechaEmision",
      "observaciones",
      "prioridad",
      "clienteId",
      "destinoId",
      "estadoId",
      "razonNoEntrega",
    ];
    const mercaderiaFields = [
      "tipoMercaderia",
      "valorDeclarado",
      "volumenMetrosCubico",
      "pesoMercaderia",
      "cantidadBobinas",
      "cantidadRacks",
      "cantidadBultos",
      "cantidadPallets",
      "requisitosEspeciales",
    ];
    const remitoUpdateData = {};
    const mercaderiaUpdateData = {}; // Separar los datos del body para cada modelo

    for (const key in data) {
      if (remitoFields.includes(key)) {
        remitoUpdateData[key] = data[key];
      }

      if (mercaderiaFields.includes(key)) {
        mercaderiaUpdateData[key] = data[key];
      }
    }

    console.log("Datos para actualizar Remito:", remitoUpdateData);
    await remito.update(remitoUpdateData); // Si hay mercadería asociada, actualizarla con sus datos

    if (remito.mercaderiaId) {
      const mercaderia = await Mercaderia.findByPk(remito.mercaderiaId);

      if (mercaderia) {
        // Función para convertir valores a enteros para campos BIGINT
        const convertToInteger = (value) => {
          if (value === null || value === undefined || value === "")
            return null;
          const numValue = parseFloat(value);
          return isNaN(numValue) ? null : Math.floor(numValue);
        }; // Convertir valores numéricos a enteros

        const mercaderiaUpdateDataProcessed = {
          ...mercaderiaUpdateData,
          valorDeclarado: convertToInteger(mercaderiaUpdateData.valorDeclarado),
          volumenMetrosCubico: convertToInteger(
            mercaderiaUpdateData.volumenMetrosCubico
          ),
          pesoMercaderia: convertToInteger(mercaderiaUpdateData.pesoMercaderia),
          cantidadBobinas: convertToInteger(
            mercaderiaUpdateData.cantidadBobinas
          ),
          cantidadRacks: convertToInteger(mercaderiaUpdateData.cantidadRacks),
          cantidadBultos: convertToInteger(mercaderiaUpdateData.cantidadBultos),
          cantidadPallets: convertToInteger(
            mercaderiaUpdateData.cantidadPallets
          ),
        };
        console.log(
          "Datos para actualizar Mercaderia:",
          mercaderiaUpdateDataProcessed
        );
        await mercaderia.update(mercaderiaUpdateDataProcessed);
        console.log("Mercadería actualizada exitosamente.");
      } else {
        console.log(
          "Error: Mercadería asociada no encontrada con ID:",
          remito.mercaderiaId
        );
      }
    } else {
      console.log("Info: El remito no tiene ID de mercadería asociada.");
    } // Devolver el remito completo y actualizado con todas sus relaciones

    const remitoActualizado = await Remito.findByPk(id, {
      include: ["cliente", "destino", "estado", "mercaderia"],
    });
    console.log("--- Finalizando actualización de Remito ---");
    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error(`Error al actualizar remito con ID ${id}:`, error);
    res.status(500).json({
      message: "Error al actualizar el remito",
    });
  }
};

controller.updateRemito = updateRemito;

const updateEstadoRemito = async (req, res) => {
  const remitoId = req.params.id;
  const estId = req.params.eid;
  const remito = await Remito.findByPk(remitoId);
  await remito.update({
    estadoId: estId,
  });
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
    ],
  });
  res.status(200).json(remitoActualizado);
};

controller.updateEstadoRemito = updateEstadoRemito;

const deleteRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.destroy();
  res.status(200).json({
    message: "Remito eliminado correctamente",
  });
};

controller.deleteRemito = deleteRemito; // Reporte: Volumen total de mercadería por cliente/período

const getVolumenPorClientePeriodo = async (req, res) => {
  const { clienteId, fechaDesde, fechaHasta } = req.query;

  const { Remito, Mercaderia, Cliente } = require("../models");

  try {
    const where = {};
    if (clienteId) where.clienteId = clienteId;

    if (fechaDesde && fechaHasta) {
      where.fechaEmision = {
        $between: [fechaDesde, fechaHasta],
      };
    } else if (fechaDesde) {
      where.fechaEmision = {
        $gte: fechaDesde,
      };
    } else if (fechaHasta) {
      where.fechaEmision = {
        $lte: fechaHasta,
      };
    }

    const remitos = await Remito.findAll({
      where,
      include: [
        {
          model: Mercaderia,
          as: "mercaderia",
        },
        {
          model: Cliente,
          as: "cliente",
        },
      ],
    }); // Agrupar por cliente

    const resultado = {};
    remitos.forEach((remito) => {
      const cliente = remito.cliente;
      const razonSocial = cliente ? cliente.razonSocial : "Sin cliente";
      const volumen = remito.mercaderia
        ? remito.mercaderia.volumenMetrosCubico
        : 0;

      if (!resultado[razonSocial]) {
        resultado[razonSocial] = 0;
      }

      resultado[razonSocial] += volumen;
    }); // Formatear para frontend

    const data = Object.entries(resultado).map(([cliente, volumenTotal]) => ({
      cliente,
      volumenTotal,
    }));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener el reporte de volumen por cliente/período",
    });
  }
};

controller.getVolumenPorClientePeriodo = getVolumenPorClientePeriodo;
module.exports = controller;
//# sourceMappingURL=remitoController.js.map
