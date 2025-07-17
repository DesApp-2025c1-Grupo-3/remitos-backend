const {
  Remito,
  Cliente,
  Destino,
  Mercaderia,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");
const controller = {};

// 1. Volumen total de mercadería por cliente/período
controller.getVolumenPorClientePeriodo = async (req, res) => {
  const { clienteId, fechaDesde, fechaHasta } = req.query;
  try {
    const where = {};
    if (clienteId) where.clienteId = clienteId;
    if (fechaDesde && fechaHasta) {
      where.fechaEmision = { [Op.between]: [fechaDesde, fechaHasta] };
    } else if (fechaDesde) {
      where.fechaEmision = { [Op.gte]: fechaDesde };
    } else if (fechaHasta) {
      where.fechaEmision = { [Op.lte]: fechaHasta };
    }

    // Usar consulta SQL directa para evitar problemas con GROUP BY
    const query = `
      SELECT 
        COALESCE(c."razonSocial", 'Sin cliente') as cliente,
        SUM(COALESCE(m."volumenMetrosCubico", 0)) as "volumenTotal"
      FROM "Remitos" r
      LEFT JOIN "Mercaderia" m ON r."mercaderiaId" = m."id"
      LEFT JOIN "Clientes" c ON r."clienteId" = c."id"
      WHERE 1=1
      ${clienteId ? `AND r."clienteId" = :clienteId` : ""}
      ${
        fechaDesde && fechaHasta
          ? `AND r."fechaEmision" BETWEEN :fechaDesde AND :fechaHasta`
          : ""
      }
      ${fechaDesde && !fechaHasta ? `AND r."fechaEmision" >= :fechaDesde` : ""}
      ${!fechaDesde && fechaHasta ? `AND r."fechaEmision" <= :fechaHasta` : ""}
      GROUP BY c."razonSocial", c."id"
      ORDER BY "volumenTotal" DESC
    `;

    const replacements = {};
    if (clienteId) replacements.clienteId = clienteId;
    if (fechaDesde) replacements.fechaDesde = fechaDesde;
    if (fechaHasta) replacements.fechaHasta = fechaHasta;

    const resultado = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const data = resultado.map((item) => ({
      cliente: item.cliente,
      volumenTotal: parseFloat(item.volumenTotal) || 0,
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
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
    const where = {};
    if (clienteId) where.clienteId = clienteId;
    if (fechaDesde && fechaHasta) {
      where.fechaEmision = { [Op.between]: [fechaDesde, fechaHasta] };
    } else if (fechaDesde) {
      where.fechaEmision = { [Op.gte]: fechaDesde };
    } else if (fechaHasta) {
      where.fechaEmision = { [Op.lte]: fechaHasta };
    }
    const include = [
      { model: Destino, as: "destino" },
      { model: Cliente, as: "cliente" },
    ];
    const remitos = await Remito.findAll({ where, include });
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
    // Configurar filtros
    let whereConditions = [];
    const replacements = {};

    if (clienteId) {
      whereConditions.push('r."clienteId" = :clienteId');
      replacements.clienteId = clienteId;
    }

    if (fechaDesde && fechaHasta) {
      whereConditions.push(
        'r."fechaEmision" BETWEEN :fechaDesde AND :fechaHasta'
      );
      replacements.fechaDesde = fechaDesde;
      replacements.fechaHasta = fechaHasta;
    } else if (fechaDesde) {
      whereConditions.push('r."fechaEmision" >= :fechaDesde');
      replacements.fechaDesde = fechaDesde;
    } else if (fechaHasta) {
      whereConditions.push('r."fechaEmision" <= :fechaHasta');
      replacements.fechaHasta = fechaHasta;
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
      whereConditions.push('m."tipoMercaderia" IN (:tipos)');
      replacements.tipos = tiposArray;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Usar consulta SQL directa
    const query = `
      SELECT 
        COALESCE(m."tipoMercaderia", 'Sin tipo') as tipo,
        SUM(COALESCE(m."valorDeclarado", 0)) as "valorTotal"
      FROM "Remitos" r
      LEFT JOIN "Mercaderia" m ON r."mercaderiaId" = m."id"
      ${whereClause}
      GROUP BY m."tipoMercaderia"
      ORDER BY "valorTotal" DESC
    `;

    const resultado = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    const data = resultado.map((item) => ({
      tipo: item.tipo,
      valorTotal: parseFloat(item.valorTotal) || 0,
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener el valor declarado por tipo de mercadería",
    });
  }
};

module.exports = controller;
