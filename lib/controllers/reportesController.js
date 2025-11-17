const {
  Remito,
  Cliente,
  Destino,
  Mercaderia,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const controller = {};

// Función auxiliar para convertir fecha YYYY-MM-DD a rango UTC
function parseDateRange(fechaDesde, fechaHasta) {
  let fechaInicio = null;
  let fechaFin = null;

  if (fechaDesde) {
    const parts = fechaDesde.split("-").map(Number);
    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Interpretar la fecha YYYY-MM-DD como inicio del día en UTC
      fechaInicio = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    }
  }

  if (fechaHasta) {
    const parts = fechaHasta.split("-").map(Number);
    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Interpretar la fecha YYYY-MM-DD como fin del día en UTC
      fechaFin = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    }
  }

  return { fechaInicio, fechaFin };
}

// 1. Volumen total de mercadería por cliente/período
controller.getVolumenPorClientePeriodo = async (req, res) => {
  const { clienteId, fechaDesde, fechaHasta } = req.query;
  try {
    console.log('🔍 DEBUG Reportes - getVolumenPorClientePeriodo:', { clienteId, fechaDesde, fechaHasta });

    // Convertir fechas a rango UTC
    const { fechaInicio, fechaFin } = parseDateRange(fechaDesde, fechaHasta);

    // Usar consulta SQL directa para evitar problemas con GROUP BY
    let fechaConditions = [];
    const replacements = {};
    
    if (clienteId) replacements.clienteId = clienteId;
    
    if (fechaInicio && fechaFin) {
      fechaConditions.push(`r."fechaEmision" BETWEEN :fechaDesde AND :fechaHasta`);
      replacements.fechaDesde = fechaInicio;
      replacements.fechaHasta = fechaFin;
    } else if (fechaInicio) {
      fechaConditions.push(`r."fechaEmision" >= :fechaDesde`);
      replacements.fechaDesde = fechaInicio;
    } else if (fechaFin) {
      fechaConditions.push(`r."fechaEmision" <= :fechaHasta`);
      replacements.fechaHasta = fechaFin;
    }

    const query = `
      SELECT 
        COALESCE(c."razonSocial", 'Sin cliente') as cliente,
        SUM(COALESCE(m."volumenMetrosCubico", 0)) as "volumenTotal"
      FROM "Remitos" r
      LEFT JOIN "Mercaderia" m ON m."remitoId" = r."id"
      LEFT JOIN "Clientes" c ON r."clienteId" = c."id"
      WHERE 1=1
      ${clienteId ? `AND r."clienteId" = :clienteId` : ""}
      ${fechaConditions.length > 0 ? `AND ${fechaConditions.join(" AND ")}` : ""}
      GROUP BY c."razonSocial", c."id"
      ORDER BY "volumenTotal" DESC
    `;

    console.log('🔍 DEBUG Reportes - Query:', query);
    console.log('🔍 DEBUG Reportes - Replacements:', replacements);

    const resultado = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    console.log('🔍 DEBUG Reportes - Resultados encontrados:', resultado.length);

    const data = resultado.map((item) => ({
      cliente: item.cliente,
      volumenTotal: parseFloat(item.volumenTotal) || 0,
    }));

    res.json(data);
  } catch (error) {
    console.error('❌ Error en getVolumenPorClientePeriodo:', error);
    res.status(500).json({
      error: "Error al obtener el reporte de volumen por cliente/período",
    });
  }
};

// 2. Distribución geográfica de orígenes y destinos
controller.getDistribucionGeografica = async (req, res) => {
  const {
    pais,
    provincia,
    localidad,
    tipo,
    clienteId,
    fechaDesde,
    fechaHasta,
  } = req.query;
  try {
    console.log('🔍 DEBUG Reportes - getDistribucionGeografica:', { pais, provincia, localidad, tipo, clienteId, fechaDesde, fechaHasta });

    const where = {};
    if (clienteId) where.clienteId = clienteId;
    
    // Convertir fechas a rango UTC
    const { fechaInicio, fechaFin } = parseDateRange(fechaDesde, fechaHasta);
    if (fechaInicio && fechaFin) {
      where.fechaEmision = { [Op.between]: [fechaInicio, fechaFin] };
    } else if (fechaInicio) {
      where.fechaEmision = { [Op.gte]: fechaInicio };
    } else if (fechaFin) {
      where.fechaEmision = { [Op.lte]: fechaFin };
    }
    
    console.log('🔍 DEBUG Reportes - Where clause:', JSON.stringify(where, null, 2));
    
    const include = [
      { model: Destino, as: "destino" },
      { model: Cliente, as: "cliente" },
    ];
    const remitos = await Remito.findAll({ where, include });
    
    console.log('🔍 DEBUG Reportes - Remitos encontrados:', remitos.length);
    // Agrupar por país, provincia, localidad, origen/destino
    const resultado = {};
    remitos.forEach((remito) => {
      let paisVal = "-",
        provinciaVal = "-",
        localidadVal = "-",
        origen = "-",
        destino = "-";
      if (tipo === "origen") {
        origen = remito.cliente ? remito.cliente.razonSocial : "Sin cliente";
        paisVal =
          remito.cliente && remito.cliente.pais ? remito.cliente.pais : "-";
        provinciaVal =
          remito.cliente && remito.cliente.provincia
            ? remito.cliente.provincia
            : "-";
        localidadVal =
          remito.cliente && remito.cliente.localidad
            ? remito.cliente.localidad
            : "-";
      } else {
        destino = remito.destino ? remito.destino.nombre : "Sin destino";
        paisVal =
          remito.destino && remito.destino.pais ? remito.destino.pais : "-";
        provinciaVal =
          remito.destino && remito.destino.provincia
            ? remito.destino.provincia
            : "-";
        localidadVal =
          remito.destino && remito.destino.localidad
            ? remito.destino.localidad
            : "-";
      }
      // Filtros
      if (pais && paisVal !== pais) return;
      if (provincia && provinciaVal !== provincia) return;
      if (localidad && localidadVal !== localidad) return;
      const key = `${paisVal}|${provinciaVal}|${localidadVal}|${origen}|${destino}`;
      if (!resultado[key])
        resultado[key] = {
          pais: paisVal,
          provincia: provinciaVal,
          localidad: localidadVal,
          origen,
          destino,
          cantidad: 0,
        };
      resultado[key].cantidad += 1;
    });
    const data = Object.values(resultado);
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener la distribución geográfica" });
  }
};

// 3. Valor declarado por tipo de mercadería
controller.getValorPorTipoMercaderia = async (req, res) => {
  const { clienteId, fechaDesde, fechaHasta, tipos } = req.query;
  try {
    console.log('🔍 DEBUG Reportes - getValorPorTipoMercaderia:', { clienteId, fechaDesde, fechaHasta, tipos });

    // Configurar filtros
    let whereConditions = [];
    const replacements = {};

    if (clienteId) {
      whereConditions.push('r."clienteId" = :clienteId');
      replacements.clienteId = clienteId;
    }

    // Convertir fechas a rango UTC
    const { fechaInicio, fechaFin } = parseDateRange(fechaDesde, fechaHasta);
    if (fechaInicio && fechaFin) {
      whereConditions.push(
        'r."fechaEmision" BETWEEN :fechaDesde AND :fechaHasta'
      );
      replacements.fechaDesde = fechaInicio;
      replacements.fechaHasta = fechaFin;
    } else if (fechaInicio) {
      whereConditions.push('r."fechaEmision" >= :fechaDesde');
      replacements.fechaDesde = fechaInicio;
    } else if (fechaFin) {
      whereConditions.push('r."fechaEmision" <= :fechaHasta');
      replacements.fechaHasta = fechaFin;
    }

    // Manejar filtro de tipos
    let tiposArray = [];
    if (tipos) {
      if (Array.isArray(tipos)) {
        tiposArray = tipos;
      } else if (typeof tipos === "string") {
        tiposArray = tipos.split(",").map((t) => t.trim());
      } else if (typeof tipos === "object") {
        tiposArray = Object.values(tipos);
      }
    }

    if (tiposArray.length > 0) {
      whereConditions.push('m."tipoMercaderiaId" IN (:tipos)');
      replacements.tipos = tiposArray;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Usar consulta SQL directa con JOIN a TipoMercaderia
    const query = `
      SELECT 
        COALESCE(tm."nombre", 'Sin tipo') as tipo,
        SUM(COALESCE(m."valorDeclarado", 0)) as "valorTotal"
      FROM "Remitos" r
      LEFT JOIN "Mercaderia" m ON m."remitoId" = r."id"
      LEFT JOIN "TipoMercaderias" tm ON m."tipoMercaderiaId" = tm."id"
      ${whereClause}
      GROUP BY tm."nombre", tm."id"
      ORDER BY "valorTotal" DESC
    `;

    console.log('🔍 DEBUG Reportes - Query:', query);
    console.log('🔍 DEBUG Reportes - Replacements:', replacements);

    const resultado = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    console.log('🔍 DEBUG Reportes - Resultados encontrados:', resultado.length);

    const data = resultado.map((item) => ({
      tipo: item.tipo,
      valorTotal: parseFloat(item.valorTotal) || 0,
    }));

    res.json(data);
  } catch (error) {
    console.error('❌ Error en getValorPorTipoMercaderia:', error);
    res.status(500).json({
      error: "Error al obtener el valor declarado por tipo de mercadería",
    });
  }
};

module.exports = controller;
