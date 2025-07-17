"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener los IDs reales de clientes, destinos y estados
    const clientes = await queryInterface.sequelize.query(
      'SELECT id FROM "Clientes" ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const destinos = await queryInterface.sequelize.query(
      'SELECT id FROM "Destinos" ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const estados = await queryInterface.sequelize.query(
      'SELECT id FROM "Estados" ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Verificar que tenemos datos
    if (
      clientes.length === 0 ||
      destinos.length === 0 ||
      estados.length === 0
    ) {
      console.log(
        "No se encontraron clientes, destinos o estados para crear mercaderías y remitos"
      );
      return;
    }

    // Crear mercaderías con los campos correctos según el modelo
    const mercaderias = [
      {
        tipoMercaderia: "Electrónica",
        valorDeclarado: 50000,
        volumenMetrosCubico: 2,
        pesoMercaderia: 1500,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 50,
        cantidadPallets: 5,
        requisitosEspeciales: "Manejo especial, temperatura controlada",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Químicos",
        valorDeclarado: 75000,
        volumenMetrosCubico: 1,
        pesoMercaderia: 800,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 30,
        cantidadPallets: 3,
        requisitosEspeciales: "Cadena de frío, documentación sanitaria",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Materiales Construcción",
        valorDeclarado: 25000,
        volumenMetrosCubico: 8,
        pesoMercaderia: 5000,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 0,
        cantidadPallets: 12,
        requisitosEspeciales: "Manejo con equipos especiales",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Alimentos",
        valorDeclarado: 35000,
        volumenMetrosCubico: 3,
        pesoMercaderia: 2000,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 40,
        cantidadPallets: 8,
        requisitosEspeciales: "Cadena de frío, control de humedad",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Textil",
        valorDeclarado: 45000,
        volumenMetrosCubico: 4,
        pesoMercaderia: 1200,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 60,
        cantidadPallets: 6,
        requisitosEspeciales: "Protección contra humedad",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Automotriz",
        valorDeclarado: 120000,
        volumenMetrosCubico: 6,
        pesoMercaderia: 3000,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 25,
        cantidadPallets: 10,
        requisitosEspeciales: "Manejo cuidadoso, embalaje especial",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Químicos",
        valorDeclarado: 80000,
        volumenMetrosCubico: 2,
        pesoMercaderia: 2500,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 0,
        cantidadPallets: 4,
        requisitosEspeciales:
          "Certificaciones de seguridad, transporte especial",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Otros",
        valorDeclarado: 30000,
        volumenMetrosCubico: 3,
        pesoMercaderia: 1800,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 35,
        cantidadPallets: 7,
        requisitosEspeciales: "Protección contra humedad y golpes",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Otros",
        valorDeclarado: 40000,
        volumenMetrosCubico: 4,
        pesoMercaderia: 2200,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 45,
        cantidadPallets: 9,
        requisitosEspeciales: "Manejo estándar",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Materiales Construcción",
        valorDeclarado: 150000,
        volumenMetrosCubico: 10,
        pesoMercaderia: 8000,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 0,
        cantidadPallets: 15,
        requisitosEspeciales: "Equipos especiales de carga",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Electrónica",
        valorDeclarado: 65000,
        volumenMetrosCubico: 3,
        pesoMercaderia: 2000,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 70,
        cantidadPallets: 8,
        requisitosEspeciales: "Manejo especial, embalaje antiestático",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Alimentos",
        valorDeclarado: 28000,
        volumenMetrosCubico: 2,
        pesoMercaderia: 1500,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 25,
        cantidadPallets: 4,
        requisitosEspeciales: "Refrigeración, control de temperatura",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Textil",
        valorDeclarado: 38000,
        volumenMetrosCubico: 5,
        pesoMercaderia: 1800,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 80,
        cantidadPallets: 10,
        requisitosEspeciales: "Protección contra humedad y polvo",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tipoMercaderia: "Automotriz",
        valorDeclarado: 95000,
        volumenMetrosCubico: 4,
        pesoMercaderia: 2500,
        cantidadBobinas: 0,
        cantidadRacks: 0,
        cantidadBultos: 20,
        cantidadPallets: 6,
        requisitosEspeciales: "Manejo cuidadoso, embalaje especial",
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insertar mercaderías
    await queryInterface.bulkInsert("Mercaderia", mercaderias, {});

    // Obtener las mercaderías insertadas
    const mercaderiasInsertadas = await queryInterface.sequelize.query(
      'SELECT id FROM "Mercaderia" ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Crear remitos con distribución temporal realista (últimos 6 meses)
    const remitos = [];

    // Función para generar fechas distribuidas en los últimos 6 meses
    const generarFechaDistribuida = (index, total) => {
      const ahora = new Date();
      const seisMesesAtras = new Date(
        ahora.getTime() - 6 * 30 * 24 * 60 * 60 * 1000
      );
      const tiempoTotal = ahora.getTime() - seisMesesAtras.getTime();
      const tiempoPorItem = tiempoTotal / total;
      const fecha = new Date(seisMesesAtras.getTime() + index * tiempoPorItem);

      // Agregar variación aleatoria de ±3 días para que no sea tan uniforme
      const variacion = (Math.random() - 0.5) * 6 * 24 * 60 * 60 * 1000;
      return new Date(fecha.getTime() + variacion);
    };

    // Distribución realista: algunos clientes tendrán más remitos, otros menos, y variedad de tipos de empresa
    // Usar los primeros 3 como empresas privadas, los siguientes 3 como organismos estatales, los siguientes 3 como particulares
    // Alternar tipos de mercadería y destinos
    const remitosPorCliente = [8, 7, 6, 5, 4, 4, 3, 3, 2, 2]; // Suma 44 remitos
    let remitoIndex = 0;
    let clientePointer = 0;

    for (let tipo = 0; tipo < remitosPorCliente.length; tipo++) {
      for (let j = 0; j < remitosPorCliente[tipo]; j++) {
        const clienteIndex = clientePointer % clientes.length;
        const destinoIndex = (remitoIndex * 2 + tipo) % destinos.length;
        const mercaderiaIndex =
          (remitoIndex + tipo) % mercaderiasInsertadas.length;
        const estadoIndex = (remitoIndex + tipo) % estados.length;

        // Generar fecha distribuida en el tiempo
        const fechaEmision = generarFechaDistribuida(remitoIndex, 44);
        const fechaCreacion = new Date(
          fechaEmision.getTime() + Math.random() * 24 * 60 * 60 * 1000
        ); // 0-24 horas después

        remitos.push({
          numeroAsignado: `REM-${String(remitoIndex + 1).padStart(
            4,
            "0"
          )}-${fechaEmision.getFullYear()}`,
          fechaEmision: fechaEmision,
          observaciones: `Observaciones del remito ${remitoIndex + 1}`,
          archivoAdjunto: null,
          prioridad:
            remitoIndex % 3 === 0
              ? "urgente"
              : remitoIndex % 3 === 1
              ? "alta"
              : "normal",
          activo: true,
          clienteId: clientes[clienteIndex].id,
          destinoId: destinos[destinoIndex].id,
          estadoId: estados[estadoIndex].id,
          mercaderiaId: mercaderiasInsertadas[mercaderiaIndex].id,
          createdAt: fechaCreacion,
          updatedAt: fechaCreacion,
        });
        remitoIndex++;
      }
      clientePointer++;
    }

    await queryInterface.bulkInsert("Remitos", remitos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Remitos", null, {});
    await queryInterface.bulkDelete("Mercaderia", null, {});
  },
};
