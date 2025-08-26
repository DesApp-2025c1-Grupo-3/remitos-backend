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
    const offset = (page - 1) * limit;

    // Filtros
    const where = {};
    if (req.query.numeroAsignado) {
      where.numeroAsignado = { [Op.iLike]: `%${req.query.numeroAsignado}%` };
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
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error al obtener remitos:", error);
    res.status(500).json({ message: "Error al obtener los remitos" });
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
    clienteId,
    estadoId,
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
    prioridad,
  } = req.body;
  
  const fechaEmision = new Date();
  const archivoEnviado = req.file?.path || null;
  
  const remito = await Remito.create({
    numeroAsignado,
    clienteId,
    estadoId,
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
    prioridad,
  });
  
  res.status(201).json(remito);
};
controller.createRemito = createRemito;

const createRemitoWithClienteAndDestino = async (req, res) => {
  const t = await sequelize.transaction(); // Iniciar transacción

  try {
    // DEBUG: Log completo del request
    console.log("🔍 DEBUG - Request body completo:", JSON.stringify(req.body, null, 2));
    console.log("🔍 DEBUG - Request headers:", req.headers);
    console.log("🔍 DEBUG - Content-Type:", req.get('Content-Type'));

    const {
      numeroAsignado,
      fechaEmision,
      observaciones,
      clienteId,
      destinoId,
      prioridad,
      tipoMercaderia,        // Frontend envía string
      tipoMercaderiaId,      // Frontend puede enviar ID
      valorDeclarado,
      volumenMetrosCubico,
      pesoMercaderia,
      cantidadBobinas,
      cantidadRacks,
      cantidadBultos,
      cantidadPallets,
      requisitosEspeciales,
    } = req.body;

    // CONVERTIR tipoMercaderia (string) a tipoMercaderiaId (number)
    let mercaderiaIdFinal = tipoMercaderiaId;
    
    if (tipoMercaderia && !tipoMercaderiaId) {
      // Obtener tipos de mercadería de la base de datos
      const { TipoMercaderia } = require("../models");
      const tiposMercaderia = await TipoMercaderia.findAll({ where: { activo: true } });
      
      console.log("🔍 DEBUG - Tipos de mercadería en BD:", tiposMercaderia.map(t => ({ id: t.id, nombre: t.nombre })));
      
      // Buscar por nombre
      const tipoEncontrado = tiposMercaderia.find(t => 
        t.nombre.toLowerCase() === tipoMercaderia.toLowerCase()
      );
      
      if (tipoEncontrado) {
        mercaderiaIdFinal = tipoEncontrado.id;
        console.log("🔄 Convertido:", tipoMercaderia, "→", mercaderiaIdFinal);
      } else {
        const tiposDisponibles = tiposMercaderia.map(t => t.nombre).join(', ');
        return res.status(400).json({ 
          message: `Tipo de mercadería '${tipoMercaderia}' no encontrado. Tipos disponibles: ${tiposDisponibles}` 
        });
      }
    }

    // DEBUG: Log de datos extraídos
    console.log("🔍 DEBUG - Datos extraídos:");
    console.log("  - tipoMercaderia (original):", tipoMercaderia);
    console.log("  - tipoMercaderiaId (convertido):", mercaderiaIdFinal);
    console.log("  - valorDeclarado:", valorDeclarado);
    console.log("  - volumenMetrosCubico:", volumenMetrosCubico);
    console.log("  - pesoMercaderia:", pesoMercaderia);
    console.log("  - clienteId:", clienteId);
    console.log("  - destinoId:", destinoId);

    // Función para convertir valores a enteros para campos BIGINT
    const convertToInteger = (value) => {
      if (value === null || value === undefined || value === "") return null;
      const numValue = parseFloat(value);
      return isNaN(numValue) ? null : Math.floor(numValue);
    };

    // Convertir valores numéricos a enteros
    const mercaderiaData = {
      tipoMercaderiaId: mercaderiaIdFinal,  // Usar el ID convertido
      valorDeclarado: convertToInteger(valorDeclarado),
      volumenMetrosCubico: convertToInteger(volumenMetrosCubico),
      pesoMercaderia: convertToInteger(pesoMercaderia),
      cantidadBobinas: convertToInteger(cantidadBobinas),
      cantidadRacks: convertToInteger(cantidadRacks),
      cantidadBultos: convertToInteger(cantidadBultos),
      cantidadPallets: convertToInteger(cantidadPallets),
      requisitosEspeciales,
    };

    // DEBUG: Log de datos de mercadería
    console.log("🔍 DEBUG - Datos de mercadería:", JSON.stringify(mercaderiaData, null, 2));

    // 1. Crear Mercaderia dentro de la transacción
    const nuevaMercaderia = await Mercaderia.create(mercaderiaData, {
      transaction: t,
    });

    // USAR ESTADO FIJO - SIMPLE Y FUNCIONAL
    const estadoId = 1;  // Estado por defecto
    console.log("🔍 DEBUG - Usando estadoId fijo:", estadoId);

    // 2. Crear Remito dentro de la transacción
    const nuevoRemito = await Remito.create(
      {
        numeroAsignado,
        fechaEmision,
        observaciones,
        prioridad,
        clienteId,
        destinoId,
        mercaderiaId: nuevaMercaderia.id,
        estadoId: estadoId,  // Estado fijo
        archivoAdjunto: req.file?.path || null,
        razonNoEntrega: req.body.razonNoEntrega,
      },
      { transaction: t }
    );

    // Si todo va bien, confirmar la transacción
    await t.commit();

    // Devolver el remito completo con sus relaciones
    const remitoCompleto = await Remito.findByPk(nuevoRemito.id, {
      include: ["cliente", "destino", "estado", "mercaderia"],
    });

    res.status(201).json(remitoCompleto);
  } catch (error) {
    // Si algo falla, revertir la transacción
    await t.rollback();
    console.error(
      "❌ Error al crear remito con mercaderia (transacción revertida):",
      error
    );
    res.status(500).json({ message: "Error al crear el remito" });
  }
};
controller.createRemitoWithClienteAndDestino = createRemitoWithClienteAndDestino;

const updateRemito = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const archivoEnviado = req.file?.path || null;

  try {
    const remito = await Remito.findByPk(id);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }

    // Definir los campos que pertenecen a cada modelo
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
    const mercaderiaUpdateData = {};

    // Separar los datos del body para cada modelo
    for (const key in data) {
      if (remitoFields.includes(key)) {
        remitoUpdateData[key] = data[key];
      }
      if (mercaderiaFields.includes(key)) {
        mercaderiaUpdateData[key] = data[key];
      }
    }

    // Si se envió un nuevo archivo, actualizar el campo archivoAdjunto
    if (archivoEnviado) {
      remitoUpdateData.archivoAdjunto = archivoEnviado;
    }

    await remito.update(remitoUpdateData);

    // Si hay mercadería asociada Y se enviaron datos de mercadería, actualizarla
    if (remito.mercaderiaId && Object.keys(mercaderiaUpdateData).length > 0) {
      const mercaderia = await Mercaderia.findByPk(remito.mercaderiaId);
      if (mercaderia) {
        // Función para convertir valores a enteros para campos BIGINT
        const convertToInteger = (value) => {
          if (value === null || value === undefined || value === "")
            return null;
          const numValue = parseFloat(value);
          return isNaN(numValue) ? null : Math.floor(numValue);
        };

        // Convertir valores numéricos a enteros
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

        await mercaderia.update(mercaderiaUpdateDataProcessed);
      } else {
        console.log(
          "Error: Mercadería asociada no encontrada con ID:",
          remito.mercaderiaId
        );
      }
    } else if (remito.mercaderiaId) {
      console.log(
        "Info: No se actualizó la mercadería porque no se enviaron datos de mercadería."
      );
    } else {
      console.log("Info: El remito no tiene ID de mercadería asociada.");
    }

    // Devolver el remito completo y actualizado con todas sus relaciones
    const remitoActualizado = await Remito.findByPk(id, {
      include: ["cliente", "destino", "estado", "mercaderia"],
    });

    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error(`Error al actualizar remito con ID ${id}:`, error);
    res.status(500).json({ message: "Error al actualizar el remito" });
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
    ],
  });
  res.status(200).json(remitoActualizado);
};
controller.updateEstadoRemito = updateEstadoRemito;

const deleteRemito = async (req, res) => {
  const id = req.params.id;
  const remito = await Remito.findByPk(id);
  await remito.destroy();
  res.status(200).json({ message: "Remito eliminado correctamente" });
};
controller.deleteRemito = deleteRemito;

// Reporte: Volumen total de mercadería por cliente/período
const getVolumenPorClientePeriodo = async (req, res) => {
  const { clienteId, fechaDesde, fechaHasta } = req.query;
  const { Remito, Mercaderia, Cliente } = require("../models");
  try {
    const where = {};
    if (clienteId) where.clienteId = clienteId;
    if (fechaDesde && fechaHasta) {
      where.fechaEmision = { $between: [fechaDesde, fechaHasta] };
    } else if (fechaDesde) {
      where.fechaEmision = { $gte: fechaDesde };
    } else if (fechaHasta) {
      where.fechaEmision = { $lte: fechaHasta };
    }
    const remitos = await Remito.findAll({
      where,
      include: [
        { model: Mercaderia, as: "mercaderia" },
        { model: Cliente, as: "cliente" },
      ],
    });
    // Agrupar por cliente
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
    });
    // Formatear para frontend
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
