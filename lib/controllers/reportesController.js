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
    const remitos = await Remito.findAll({
      where,
      include: [
        { model: Mercaderia, as: "mercaderia" },
        { model: Cliente, as: "cliente" },
      ],
    });
    const resultado = {};
    remitos.forEach((remito) => {
      const cliente = remito.cliente;
      const razonSocial = cliente ? cliente.razonSocial : "Sin cliente";
      const volumen = remito.mercaderia
        ? remito.mercaderia.volumenMetrosCubico
        : 0;
      if (!resultado[razonSocial]) resultado[razonSocial] = 0;
      resultado[razonSocial] += volumen;
    });
    const data = Object.entries(resultado).map(([cliente, volumenTotal]) => ({
      cliente,
      volumenTotal,
    }));
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
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
  const { clienteId, fechaDesde, fechaHasta } = req.query;
  try {
    const whereRemito = {};
    if (clienteId) whereRemito.clienteId = clienteId;
    if (fechaDesde && fechaHasta) {
      whereRemito.fechaEmision = { [Op.between]: [fechaDesde, fechaHasta] };
    } else if (fechaDesde) {
      whereRemito.fechaEmision = { [Op.gte]: fechaDesde };
    } else if (fechaHasta) {
      whereRemito.fechaEmision = { [Op.lte]: fechaHasta };
    }
    const remitos = await Remito.findAll({
      where: whereRemito,
      include: [{ model: Mercaderia, as: "mercaderia" }],
    });
    // Agrupar por tipo de mercadería
    const resultado = {};
    remitos.forEach((remito) => {
      const tipo = remito.mercaderia
        ? remito.mercaderia.tipoMercaderia
        : "Sin tipo";
      const valor = remito.mercaderia
        ? Number(remito.mercaderia.valorDeclarado)
        : 0;
      if (!resultado[tipo]) resultado[tipo] = 0;
      resultado[tipo] += valor;
    });
    const data = Object.entries(resultado).map(([tipo, valorTotal]) => ({
      tipo,
      valorTotal,
    }));
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Error al obtener el valor declarado por tipo de mercadería",
      });
  }
};

module.exports = controller;
