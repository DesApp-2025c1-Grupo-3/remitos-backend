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
    // Obtener los IDs reales de clientes y destinos
    const clientes = await queryInterface.sequelize.query(
      'SELECT id FROM "Clientes" ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const destinos = await queryInterface.sequelize.query(
      'SELECT id FROM "Destinos" ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Verificar que tenemos datos
    if (clientes.length === 0 || destinos.length === 0) {
      console.log("No se encontraron clientes o destinos para crear contactos");
      return;
    }

    const contactos = [];
    let contactoIndex = 0;

    // Contactos para clientes (3 por cliente para tener más datos)
    clientes.forEach((cliente, index) => {
      // Primer contacto del cliente
      contactos.push({
        personaAutorizada: `Contacto Principal ${index + 1}`,
        correoElectronico: `contacto${index + 1}@empresa${index + 1}.com`,
        telefono: `+54${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        clienteId: cliente.id,
        destinoId: null,
        createdAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
        updatedAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
      });
      contactoIndex++;

      // Segundo contacto del cliente
      contactos.push({
        personaAutorizada: `Contacto Secundario ${index + 1}`,
        correoElectronico: `admin${index + 1}@empresa${index + 1}.com`,
        telefono: `+54${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        clienteId: cliente.id,
        destinoId: null,
        createdAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
        updatedAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
      });
      contactoIndex++;

      // Tercer contacto del cliente (para clientes más grandes)
      if (index < clientes.length * 0.7) {
        // 70% de los clientes tendrán 3 contactos
        contactos.push({
          personaAutorizada: `Gerente ${index + 1}`,
          correoElectronico: `gerente${index + 1}@empresa${index + 1}.com`,
          telefono: `+54${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          clienteId: cliente.id,
          destinoId: null,
          createdAt: generarFechaDistribuida(
            contactoIndex,
            clientes.length * 3 + destinos.length * 2
          ),
          updatedAt: generarFechaDistribuida(
            contactoIndex,
            clientes.length * 3 + destinos.length * 2
          ),
        });
        contactoIndex++;
      }
    });

    // Contactos para destinos (2 por destino para tener más datos)
    destinos.forEach((destino, index) => {
      // Primer contacto del destino
      contactos.push({
        personaAutorizada: `Responsable ${index + 1}`,
        correoElectronico: `responsable${index + 1}@destino${index + 1}.com`,
        telefono: `+54${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        clienteId: null,
        destinoId: destino.id,
        createdAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
        updatedAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
      });
      contactoIndex++;

      // Segundo contacto del destino
      contactos.push({
        personaAutorizada: `Supervisor ${index + 1}`,
        correoElectronico: `supervisor${index + 1}@destino${index + 1}.com`,
        telefono: `+54${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        clienteId: null,
        destinoId: destino.id,
        createdAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
        updatedAt: generarFechaDistribuida(
          contactoIndex,
          clientes.length * 3 + destinos.length * 2
        ),
      });
      contactoIndex++;
    });

    await queryInterface.bulkInsert("Contactos", contactos, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Contactos", null, {});
  },
};
