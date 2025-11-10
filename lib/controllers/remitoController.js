const { includes } = require("lodash");
const {
  Remito,
  Cliente,
  Destino,
  Contacto,
  Estado,
  Mercaderia,
  TipoMercaderia,
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
    // Soporte para rango de fecha: fechaDesde / fechaHasta
    if (req.query.fechaDesde || req.query.fechaHasta) {
      let fechaInicio;
      let fechaFin;
      if (req.query.fechaDesde) {
        const parts = req.query.fechaDesde.split("-").map(Number);
        if (parts.length === 3) {
          const [year, month, day] = parts;
          // Interpretar la fecha YYYY-MM-DD como inicio del día en UTC
          fechaInicio = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        }
      }
      if (req.query.fechaHasta) {
        const parts = req.query.fechaHasta.split("-").map(Number);
        if (parts.length === 3) {
          const [year, month, day] = parts;
          // Interpretar la fecha YYYY-MM-DD como fin del día en UTC
          fechaFin = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
        }
      }

      if (fechaInicio && fechaFin) {
        where.fechaEmision = { [Op.gte]: fechaInicio, [Op.lte]: fechaFin };
      } else if (fechaInicio) {
        where.fechaEmision = { [Op.gte]: fechaInicio };
      } else if (fechaFin) {
        where.fechaEmision = { [Op.lte]: fechaFin };
      }
    }
    if (req.query.fechaEmision) {
      // Compatibilidad hacia atrás: buscar por fecha específica (formato YYYY-MM-DD)
  const [year, month, day] = req.query.fechaEmision.split("-").map(Number);
  // Interpretar la fecha YYYY-MM-DD como rango UTC para evitar desfases por zona horaria del servidor
  const fechaInicio = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const fechaFin = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

      where.fechaEmision = {
        [Op.gte]: fechaInicio,
        [Op.lte]: fechaFin,
      };
    }
    if (req.query.fechaAgenda) {
      if (req.query.fechaAgenda === 'null') {
        // Filtrar remitos sin fechaAgenda (null)
        where.fechaAgenda = { [Op.is]: null };
      } else {
        // Buscar por fecha específica de agenda (formato YYYY-MM-DD)
        const [year, month, day] = req.query.fechaAgenda.split("-").map(Number);
        // Interpretar la fecha YYYY-MM-DD como rango UTC para fechaAgenda
        const fechaInicio = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const fechaFin = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

        where.fechaAgenda = {
          [Op.gte]: fechaInicio,
          [Op.lte]: fechaFin,
        };
      }
    }
    //filtro por destino
    const whereDestino = {};
    if (req.query.pais) whereDestino.pais = { [Op.iLike]: `%${req.query.pais}%` };
    if (req.query.provincia) whereDestino.provincia = { [Op.iLike]: `%${req.query.provincia}%` };
    if (req.query.localidad) whereDestino.localidad = { [Op.iLike]: `%${req.query.localidad}%` };

    const { count, rows } = await Remito.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Destino,
          as: "destino",
          where: Object.keys(whereDestino).length ? whereDestino : undefined,
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
          as: "mercaderias",
          include: [
            {
              model: require("../models").TipoMercaderia,
              as: "tipoMercaderia",
            },
          ],
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
        as: "mercaderias",
        include: [{ model: TipoMercaderia, as: "tipoMercaderia" }]
      },
    ],
  });
  res.status(200).json(remito);
};
controller.getRemitoById = getRemitoById;

// Obtiene múltiples remitos por una lista de IDs
const getRemitosByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Debe enviar un array de IDs" });
    }

    const remitos = await Remito.findAll({
      where: { id: ids },
      include: [
        { model: Destino, as: "destino" },
        { model: Cliente, as: "cliente" },
        { model: Estado, as: "estado" },
        {
          model: Mercaderia,
          as: "mercaderias",
          include: [{ model: TipoMercaderia, as: "tipoMercaderia" }],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    // Mantener el orden según el array de entrada
    const mapById = new Map(remitos.map((r) => [r.id, r]));
    const remitosOrdenados = ids.map((id) => mapById.get(id)).filter(Boolean);

    res.status(200).json({ data: remitosOrdenados, totalItems: remitosOrdenados.length });
  } catch (error) {
    console.error("Error al obtener remitos por IDs:", error);
    res.status(500).json({ message: "Error al obtener los remitos" });
  }
};
controller.getRemitosByIds = getRemitosByIds;

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
    console.log("🔍 DEBUG - Request body completo:", JSON.stringify(req.body, null, 2));
    console.log("🔍 DEBUG - Request headers:", req.headers);
    console.log("🔍 DEBUG - Content-Type:", req.get("Content-Type"));

    const {
      numeroAsignado,
      fechaEmision,
      fechaAgenda,
      observaciones,
      clienteId,
      destinoId,
      prioridad,
      mercaderias: mercaderiasRaw,
      razonNoEntrega,
    } = req.body;

    // Parsear mercaderías si viene como JSON string (desde FormData)
    let mercaderias;
    if (typeof mercaderiasRaw === 'string') {
      try {
        mercaderias = JSON.parse(mercaderiasRaw);
      } catch (error) {
        console.error('Error al parsear mercaderías:', error);
        return res.status(400).json({ message: "Formato inválido de mercaderías" });
      }
    } else {
      mercaderias = mercaderiasRaw;
    }

    if (!mercaderias || !Array.isArray(mercaderias) || mercaderias.length === 0) {
      return res.status(400).json({ message: "Debe incluir al menos una mercadería" });
    }

    const { TipoMercaderia } = require("../models");

    // Validar cada mercadería
    for (const m of mercaderias) {
      if (!m.tipoMercaderiaId) {
        return res.status(400).json({ message: "tipoMercaderiaId es requerido en cada mercadería" });
      }
      const tipoExiste = await TipoMercaderia.findByPk(m.tipoMercaderiaId);
      if (!tipoExiste) {
        return res.status(400).json({ message: `Tipo de mercadería con ID ${m.tipoMercaderiaId} no encontrado` });
      }
      console.log("🔍 DEBUG - Datos de mercadería a crear:", JSON.stringify(m, null, 2));
    }

    // Crear Remito
    const estadoId = 1; // Estado por defecto: "Autorizado"
    console.log("🔍 DEBUG - Usando estadoId fijo:", estadoId);

    const nuevoRemito = await Remito.create(
      {
        numeroAsignado,
        fechaEmision,
        fechaAgenda: fechaAgenda || null,
      observaciones,
      prioridad,
      clienteId,
      destinoId,
      estadoId,
      archivoAdjunto: req.file?.path || null,
      razonesNoEntrega: razonNoEntrega ? [razonNoEntrega] : null,
      },
      { transaction: t }
    );

    // Crear cada mercadería asociada al remito
    for (const m of mercaderias) {
      await Mercaderia.create(
        {
          ...m,
          remitoId: nuevoRemito.id,
        },
        { transaction: t }
      );
    }

    await t.commit();

    const remitoCompleto = await Remito.findByPk(nuevoRemito.id, {
      include: ["cliente", "destino", "estado", "mercaderias"],
    });

    res.status(201).json(remitoCompleto);
  } catch (error) {
    // Solo hacer rollback si la transacción no ha sido commitada
    if (!t.finished) {
      await t.rollback();
    }
    console.error("❌ Error al crear remito con mercaderia (transacción revertida):", error);
    res.status(500).json({ message: "Error al crear el remito" });
  }
};

controller.createRemitoWithClienteAndDestino = createRemitoWithClienteAndDestino;

const updateRemito = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const archivoEnviado = req.file?.path || null;

  try {
    const remito = await Remito.findByPk(id, {
      include: [{ model: Mercaderia, as: "mercaderias" }],
    });

    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }

    console.log("🔍 DEBUG - Body recibido:", JSON.stringify(data, null, 2));

    // ---- CAMPOS DEL REMITO ----
    const remitoFields = [
      "numeroAsignado",
      "fechaEmision",
      "observaciones",
      "prioridad",
      "clienteId",
      "destinoId",
      "estadoId",
      "razonesNoEntrega",
      "fechaAgenda", 
    ];

    const remitoUpdateData = {};
    for (const key of remitoFields) {
      if (data[key] !== undefined) {
        remitoUpdateData[key] = data[key];
      }
    }

    // Si se envió un nuevo archivo
    if (archivoEnviado) {
      remitoUpdateData.archivoAdjunto = archivoEnviado;
    }

    // Validar agenda - permitir agendar desde cualquier estado
    if (data.fechaAgenda && remitoUpdateData.estadoId) {
      remitoUpdateData.fechaAgenda = data.fechaAgenda;
      
      // Cambiar estado a "Agendado" cuando se asigna fechaAgenda
      const estadoAgendado = await Estado.findOne({ where: { nombre: "Agendado" } });
      if (estadoAgendado) {
        remitoUpdateData.estadoId = estadoAgendado.id;
        console.log("✅ Se guardó fechaAgenda y se cambió estado a Agendado");
      } else {
        console.log("⚠️ No se encontró el estado Agendado");
      }
    }
    
    // Si solo se asigna fechaAgenda sin cambiar estado
    if (data.fechaAgenda && !remitoUpdateData.estadoId) {
      remitoUpdateData.fechaAgenda = data.fechaAgenda;
      
      // Cambiar estado a "Agendado"
      const estadoAgendado = await Estado.findOne({ where: { nombre: "Agendado" } });
      if (estadoAgendado) {
        remitoUpdateData.estadoId = estadoAgendado.id;
        console.log("✅ Se guardó fechaAgenda y se cambió estado a Agendado");
      }
    }

    // ---- ACTUALIZAR REMITO ----
    await remito.update(remitoUpdateData);

    // ---- MERCADERÍAS ----
    // Parsear mercaderías si viene como JSON string (desde FormData)
    let mercaderias;
    if (typeof data.mercaderias === 'string') {
      try {
        mercaderias = JSON.parse(data.mercaderias);
      } catch (error) {
        console.error('Error al parsear mercaderías:', error);
        return res.status(400).json({ message: "Formato inválido de mercaderías" });
      }
    } else {
      mercaderias = data.mercaderias;
    }

    if (Array.isArray(mercaderias)) {
      console.log("🔍 DEBUG - Mercaderías recibidas:", mercaderias);

      const mercaderiasActuales = await Mercaderia.findAll({
        where: { remitoId: remito.id },
      });

      const idsActuales = mercaderiasActuales.map((m) => m.id);
      const idsEnviados = mercaderias.filter(m => m.id).map((m) => m.id);

      // 1. Actualizar o crear mercaderías
      for (const m of mercaderias) {
        if (m.id && idsActuales.includes(m.id)) {
          // Actualizar existente
          const mercaderia = mercaderiasActuales.find(ma => ma.id === m.id);
          if (mercaderia) {
            await mercaderia.update(m);
            console.log(`✏️ Mercadería ID ${m.id} actualizada`);
          }
        } else {
          // Crear nueva
          await Mercaderia.create({ ...m, remitoId: remito.id });
          console.log("➕ Mercadería creada:", m);
        }
      }

      // 2. Eliminar mercaderías que ya no están
      const idsAEliminar = idsActuales.filter((id) => !idsEnviados.includes(id));
      if (idsAEliminar.length > 0) {
        await Mercaderia.destroy({ where: { id: idsAEliminar } });
        console.log("🗑️ Mercaderías eliminadas:", idsAEliminar);
      }
    } else {
      console.log("ℹ️ No se enviaron mercaderías para actualizar");
    }

    // ---- DEVOLVER REMITO COMPLETO ----
    const remitoActualizado = await Remito.findByPk(id, {
  include: [
    { model: Cliente, as: "cliente" },
    { model: Destino, as: "destino" },
    { model: Estado, as: "estado" },
    { 
      model: Mercaderia, 
      as: "mercaderias",
      include: [{ model: TipoMercaderia, as: "tipoMercaderia" }]
    }
  ],
});

    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error(`❌ Error al actualizar remito con ID ${id}:`, error);
    res.status(500).json({ message: "Error al actualizar el remito" });
  }
};

controller.updateRemito = updateRemito;


const liberarRemito = async (req, res) => {
  try {
    const remitoId = req.params.id;
    
    const remito = await Remito.findByPk(remitoId);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }
    
    if (!remito.estadoAnteriorId) {
      return res.status(400).json({ message: "No hay estado anterior para liberar" });
    }
    
    // Liberar al estado anterior
    await remito.update({ 
      estadoId: remito.estadoAnteriorId,
      estadoAnteriorId: null // Limpiar el estado anterior
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
  } catch (error) {
    console.error('Error en liberarRemito:', error);
    res.status(500).json({ message: "Error al liberar el remito" });
  }
};

const updateEstadoRemito = async (req, res) => {
  try {
    const remitoId = req.params.id;
    const estId = req.params.eid;
    
    const remito = await Remito.findByPk(remitoId);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }
    
    // Si el nuevo estado es "Retenido", guardar el estado actual como anterior
    const nuevoEstado = await Estado.findByPk(estId);
    if (nuevoEstado && nuevoEstado.nombre === 'Retenido') {
      await remito.update({ 
        estadoId: estId,
        estadoAnteriorId: remito.estadoId 
      });
    } else {
      await remito.update({ estadoId: estId });
    }
    
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
  } catch (error) {
    console.error('Error en updateEstadoRemito:', error);
    res.status(500).json({ message: "Error al actualizar el estado del remito" });
  }
};
controller.liberarRemito = liberarRemito;
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

const entregarRemito = async (req, res) => {
  const remitoId = req.params.id;
  const archivoFirmado = req.file?.path;
  if (!archivoFirmado) {
    return res.status(400).json({ message: "Se requiere un archivo firmado" });
  }

  try {
    const remito = await Remito.findByPk(remitoId);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }
    // Buscar estado "Entregado"
    const estadoEntregado = await Estado.findOne({ where: { nombre: "Entregado" } });
    if (!estadoEntregado) {
      return res.status(400).json({ message: "No existe estado 'Entregado'" });
    }

    // Actualizar remito
    await remito.update({
      remitoFirmado: archivoFirmado,
      estadoId: estadoEntregado.id
    });
    const remitoActualizado = await Remito.findByPk(remitoId, {
      include: ["cliente", "destino", "estado", "mercaderias"]
    });
    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error("❌ Error al entregar remito:", error);
    res.status(500).json({ message: "Error al entregar el remito" });
  }
};

controller.entregarRemito = entregarRemito;

const remitoNoEntregado = async (req, res) => {
  const remitoId = req.params.id;
  const { razonNoEntrega } = req.body;
  if (!razonNoEntrega) {
    return res.status(400).json({ message: "Se requiere la razón de no entrega" });
  }
  try {
    const remito = await Remito.findByPk(remitoId);
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }
    // Buscar estado "No Entregado"
    const estadoNoEntregado = await Estado.findOne({ where: { nombre: "No entregado" } });
    if (!estadoNoEntregado) {
      return res.status(400).json({ message: "No existe estado 'No Entregado'" });
    }
    
    // Agregar la nueva razón al array existente
    const razonesExistentes = remito.razonesNoEntrega || [];
    const nuevasRazones = [...razonesExistentes, razonNoEntrega];
    
    // Actualizar remito
    await remito.update({
      razonesNoEntrega: nuevasRazones,
      estadoId: estadoNoEntregado.id
    });
    const remitoActualizado = await Remito.findByPk(remitoId, {
      include: ["cliente", "destino", "estado", "mercaderias"]
    });
    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error("❌ Error al marcar remito como no entregado:", error);
    res.status(500).json({ message: "Error al actualizar el remito" });
  }
}; 
controller.remitoNoEntregado = remitoNoEntregado;

const iniciarReentrega = async (req, res) => {
  const remitoId = req.params.id;
  
  try {
    const remito = await Remito.findByPk(remitoId, {
      include: ["cliente", "destino", "estado", "mercaderias"]
    });
    
    if (!remito) {
      return res.status(404).json({ message: "Remito no encontrado" });
    }
    
    // Validar que esté en estado "No entregado" (id: 6)
    const estadoNoEntregado = await Estado.findOne({ where: { nombre: "No entregado" } });
    if (!estadoNoEntregado || remito.estadoId !== estadoNoEntregado.id) {
      return res.status(400).json({ 
        message: "Solo se puede reintentar la entrega de remitos en estado 'No entregado'" 
      });
    }
    
    // Validar que no sea ya una reentrega (solo se permite 1 reentrega)
    if (remito.esReentrega) {
      return res.status(400).json({ 
        message: "No se puede reintentar la entrega. Este remito ya fue reenviado una vez." 
      });
    }
    
    // Buscar estado "En preparación" (id: 2)
    const estadoEnPreparacion = await Estado.findOne({ where: { nombre: "En preparación" } });
    if (!estadoEnPreparacion) {
      return res.status(400).json({ message: "No existe estado 'En preparación'" });
    }
    
    // Actualizar remito para reentrega (mantener historial de razones)
    await remito.update({
      estadoId: estadoEnPreparacion.id,
      esReentrega: true
    });
    
    // Obtener remito actualizado con todas las relaciones
    const remitoActualizado = await Remito.findByPk(remitoId, {
      include: [
        { model: Cliente, as: "cliente" },
        { model: Destino, as: "destino" },
        { model: Estado, as: "estado" },
        { 
          model: Mercaderia, 
          as: "mercaderias",
          include: [{ model: TipoMercaderia, as: "tipoMercaderia" }]
        }
      ]
    });
    
    res.status(200).json(remitoActualizado);
  } catch (error) {
    console.error("❌ Error al iniciar reentrega:", error);
    res.status(500).json({ message: "Error al iniciar la reentrega del remito" });
  }
};
controller.iniciarReentrega = iniciarReentrega;

module.exports = controller;
