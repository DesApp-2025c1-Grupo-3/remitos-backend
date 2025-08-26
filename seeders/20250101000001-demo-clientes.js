"use strict";

// Función para generar fechas distribuidas en el tiempo
function generarFechaDistribuida(index, total) {
  const ahora = new Date();
  const unAnoAtras = new Date(ahora.getTime() - 365 * 24 * 60 * 60 * 1000);
  const tiempoTotal = ahora.getTime() - unAnoAtras.getTime();
  const tiempoPorItem = tiempoTotal / total;
  const fecha = new Date(unAnoAtras.getTime() + index * tiempoPorItem);
  // Agregar variación aleatoria de ±7 días para que no sea tan uniforme
  const variacion = (Math.random() - 0.5) * 14 * 24 * 60 * 60 * 1000;
  return new Date(fecha.getTime() + variacion);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const clientes = [
      {
        razonSocial: "YPF S.A.",
        cuit_rut: "30795657089",
        direccion: "Av. Macacha Güemes 515, CABA",
        tipoEmpresaId: 1,
        activo: true,
      },
      //       {
      //   razonSocial: "YPF S.A.",
      //   cuit_rut: "30795657089",
      //   direccion: "Av. Macacha Güemes 515, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Banco de la Nación Argentina",
      //   cuit_rut: "30500000530",
      //   direccion: "Bartolomé Mitre 326, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Mercado Libre S.R.L.",
      //   cuit_rut: "30649271501",
      //   direccion: "Arias 3751, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "ANSES",
      //   cuit_rut: "30544444417",
      //   direccion: "Av. Córdoba 720, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Falabella Argentina S.A.",
      //   cuit_rut: "30500003490",
      //   direccion: "Av. Corrientes 1234, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "AFIP",
      //   cuit_rut: "33693450239",
      //   direccion: "Av. Paseo Colón 635, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Despegar.com Argentina S.A.",
      //   cuit_rut: "30689305735",
      //   direccion: "Juana Manso 1069, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Ministerio de Economía",
      //   cuit_rut: "30709825575",
      //   direccion: "Hipólito Yrigoyen 250, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Grupo Supervielle S.A.",
      //   cuit_rut: "30500008741",
      //   direccion: "Bartolomé Mitre 434, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Hospital Italiano",
      //   cuit_rut: "30500007218",
      //   direccion: "Av. Córdoba 2351, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Grupo Galicia S.A.",
      //   cuit_rut: "30500009963",
      //   direccion: "Tte. Gral. Juan D. Perón 430, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Municipalidad de Buenos Aires",
      //   cuit_rut: "30632312916",
      //   direccion: "Uspallata 3150, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Banco Macro S.A.",
      //   cuit_rut: "30500004218",
      //   direccion: "Av. Eduardo Madero 1182, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "PAMI",
      //   cuit_rut: "30500007218",
      //   direccion: "Av. Córdoba 720, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Grupo Clarín S.A.",
      //   cuit_rut: "30500010090",
      //   direccion: "Piedras 1743, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "INDEC",
      //   cuit_rut: "30500009963",
      //   direccion: "Av. Julio A. Roca 609, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Grupo Telecom S.A.",
      //   cuit_rut: "30500008100",
      //   direccion: "Alicia Moreau de Justo 50, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Banco Central de la República Argentina",
      //   cuit_rut: "30500009963",
      //   direccion: "Reconquista 266, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Grupo Techint S.A.",
      //   cuit_rut: "30500010090",
      //   direccion: "Av. Leandro N. Alem 1067, CABA",
      //   tipoEmpresa: "Empresa privada",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Instituto Nacional de Estadística y Censos",
      //   cuit_rut: "30500009963",
      //   direccion: "Av. Julio A. Roca 609, CABA",
      //   tipoEmpresa: "Organismo estatal",
      //   activo: true,
      // },
      // // Personas físicas (ficticias, pero con formato válido)
      // {
      //   razonSocial: "Carlos Alberto López",
      //   cuit_rut: "20123456789",
      //   direccion: "Av. Santa Fe 567, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "María Elena González",
      //   cuit_rut: "27234567894",
      //   direccion: "Calle Corrientes 567, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Roberto Fernández",
      //   cuit_rut: "20333333339",
      //   direccion: "Av. San Juan 789, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Ana María López",
      //   cuit_rut: "27666666666",
      //   direccion: "Calle Florida 456, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Carlos Alberto Silva",
      //   cuit_rut: "20999999999",
      //   direccion: "Av. Callao 1234, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Laura Beatriz Rodríguez",
      //   cuit_rut: "27330303030",
      //   direccion: "Av. del Libertador 567, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Juan Carlos Pérez",
      //   cuit_rut: "20123456780",
      //   direccion: "Av. Santa Fe 1234, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Pedro Martín González",
      //   cuit_rut: "20440404040",
      //   direccion: "Av. Corrientes 2345, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Silvia Beatriz Martínez",
      //   cuit_rut: "27550505050",
      //   direccion: "Av. Rivadavia 3456, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
      // {
      //   razonSocial: "Ricardo Alberto Fernández",
      //   cuit_rut: "20660606060",
      //   direccion: "Av. Callao 789, CABA",
      //   tipoEmpresa: "Particular",
      //   activo: true,
      // },
    ];

    // Agregar fechas distribuidas en el tiempo
    const clientesConFechas = clientes.map((cliente, index) => {
      const fechaCreacion = generarFechaDistribuida(index, clientes.length);
      return {
        ...cliente,
        createdAt: fechaCreacion,
        updatedAt: fechaCreacion,
      };
    });

    await queryInterface.bulkInsert("Clientes", clientesConFechas, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Clientes", null, {});
  },
};
