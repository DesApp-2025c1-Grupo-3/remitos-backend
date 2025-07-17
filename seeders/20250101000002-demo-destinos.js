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
    const destinos = [
      {
        nombre: "Centro de Distribución Córdoba",
        pais: "Argentina",
        provincia: "Córdoba",
        localidad: "Córdoba",
        direccion: "Ruta Nacional 9 Km 15, Zona Industrial",
        activo: true,
      },
      {
        nombre: "Depósito Rosario",
        pais: "Argentina",
        provincia: "Santa Fe",
        localidad: "Rosario",
        direccion: "Av. Circunvalación 2345, Puerto Norte",
        activo: true,
      },
      {
        nombre: "Almacén Mendoza",
        pais: "Argentina",
        provincia: "Mendoza",
        localidad: "Mendoza",
        direccion: "Ruta Provincial 40 Km 8, Maipú",
        activo: true,
      },
      {
        nombre: "Centro Logístico Tucumán",
        pais: "Argentina",
        provincia: "Tucumán",
        localidad: "San Miguel de Tucumán",
        direccion: "Ruta Nacional 38 Km 12, Yerba Buena",
        activo: true,
      },
      {
        nombre: "Depósito Salta",
        pais: "Argentina",
        provincia: "Salta",
        localidad: "Salta",
        direccion: "Av. San Martín 567, Centro",
        activo: true,
      },
      {
        nombre: "Almacén Neuquén",
        pais: "Argentina",
        provincia: "Neuquén",
        localidad: "Neuquén",
        direccion: "Ruta Nacional 22 Km 5, Plottier",
        activo: true,
      },
      {
        nombre: "Centro de Distribución Bahía Blanca",
        pais: "Argentina",
        provincia: "Buenos Aires",
        localidad: "Bahía Blanca",
        direccion: "Ruta Nacional 3 Km 650, Parque Industrial",
        activo: true,
      },
      {
        nombre: "Depósito Mar del Plata",
        pais: "Argentina",
        provincia: "Buenos Aires",
        localidad: "Mar del Plata",
        direccion: "Ruta Nacional 226 Km 12, Batán",
        activo: true,
      },
      {
        nombre: "Almacén La Plata",
        pais: "Argentina",
        provincia: "Buenos Aires",
        localidad: "La Plata",
        direccion: "Ruta Provincial 6 Km 8, Tolosa",
        activo: true,
      },
      {
        nombre: "Centro Logístico San Juan",
        pais: "Argentina",
        provincia: "San Juan",
        localidad: "San Juan",
        direccion: "Ruta Nacional 40 Km 15, Rivadavia",
        activo: true,
      },
      {
        nombre: "Depósito Resistencia",
        pais: "Argentina",
        provincia: "Chaco",
        localidad: "Resistencia",
        direccion: "Av. Sarmiento 890, Centro",
        activo: true,
      },
      {
        nombre: "Almacén Posadas",
        pais: "Argentina",
        provincia: "Misiones",
        localidad: "Posadas",
        direccion: "Ruta Nacional 12 Km 5, Garupá",
        activo: true,
      },
      {
        nombre: "Centro de Distribución Jujuy",
        pais: "Argentina",
        provincia: "Jujuy",
        localidad: "San Salvador de Jujuy",
        direccion: "Ruta Nacional 9 Km 8, Perico",
        activo: true,
      },
      {
        nombre: "Depósito Santiago del Estero",
        pais: "Argentina",
        provincia: "Santiago del Estero",
        localidad: "Santiago del Estero",
        direccion: "Ruta Nacional 34 Km 12, La Banda",
        activo: true,
      },
      {
        nombre: "Almacén Catamarca",
        pais: "Argentina",
        provincia: "Catamarca",
        localidad: "San Fernando del Valle de Catamarca",
        direccion: "Ruta Nacional 38 Km 5, Valle Viejo",
        activo: true,
      },
      {
        nombre: "Centro Logístico La Rioja",
        pais: "Argentina",
        provincia: "La Rioja",
        localidad: "La Rioja",
        direccion: "Ruta Nacional 38 Km 8, Capital",
        activo: true,
      },
      {
        nombre: "Depósito San Luis",
        pais: "Argentina",
        provincia: "San Luis",
        localidad: "San Luis",
        direccion: "Ruta Nacional 7 Km 15, Juana Koslay",
        activo: true,
      },
      {
        nombre: "Centro de Distribución Paraná",
        pais: "Argentina",
        provincia: "Entre Ríos",
        localidad: "Paraná",
        direccion: "Ruta Nacional 12 Km 8, Oro Verde",
        activo: true,
      },
      {
        nombre: "Depósito Concordia",
        pais: "Argentina",
        provincia: "Entre Ríos",
        localidad: "Concordia",
        direccion: "Ruta Nacional 14 Km 15, Centro",
        activo: true,
      },
      {
        nombre: "Almacén Gualeguaychú",
        pais: "Argentina",
        provincia: "Entre Ríos",
        localidad: "Gualeguaychú",
        direccion: "Ruta Nacional 14 Km 25, Puerto",
        activo: true,
      },
      {
        nombre: "Centro Logístico Formosa",
        pais: "Argentina",
        provincia: "Formosa",
        localidad: "Formosa",
        direccion: "Ruta Nacional 11 Km 5, Laguna Blanca",
        activo: true,
      },
      {
        nombre: "Depósito Corrientes",
        pais: "Argentina",
        provincia: "Corrientes",
        localidad: "Corrientes",
        direccion: "Ruta Nacional 12 Km 10, Riachuelo",
        activo: true,
      },
      {
        nombre: "Almacén Chaco Central",
        pais: "Argentina",
        provincia: "Chaco",
        localidad: "Presidencia Roque Sáenz Peña",
        direccion: "Ruta Nacional 16 Km 12, Centro",
        activo: true,
      },
      {
        nombre: "Centro de Distribución Río Negro",
        pais: "Argentina",
        provincia: "Río Negro",
        localidad: "General Roca",
        direccion: "Ruta Nacional 22 Km 8, Allen",
        activo: true,
      },
      {
        nombre: "Depósito Viedma",
        pais: "Argentina",
        provincia: "Río Negro",
        localidad: "Viedma",
        direccion: "Ruta Nacional 3 Km 950, Carmen de Patagones",
        activo: true,
      },
      {
        nombre: "Almacén Chubut",
        pais: "Argentina",
        provincia: "Chubut",
        localidad: "Rawson",
        direccion: "Ruta Nacional 3 Km 1400, Trelew",
        activo: true,
      },
      {
        nombre: "Centro Logístico Santa Cruz",
        pais: "Argentina",
        provincia: "Santa Cruz",
        localidad: "Río Gallegos",
        direccion: "Ruta Nacional 3 Km 2600, Puerto",
        activo: true,
      },
      {
        nombre: "Depósito Tierra del Fuego",
        pais: "Argentina",
        provincia: "Tierra del Fuego",
        localidad: "Ushuaia",
        direccion: "Ruta Nacional 3 Km 3000, Puerto",
        activo: true,
      },
    ];

    // Agregar fechas distribuidas en el tiempo
    const destinosConFechas = destinos.map((destino, index) => {
      const fechaCreacion = generarFechaDistribuida(index, destinos.length);
      return {
        ...destino,
        createdAt: fechaCreacion,
        updatedAt: fechaCreacion,
      };
    });

    await queryInterface.bulkInsert("Destinos", destinosConFechas, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Destinos", null, {});
  },
};
