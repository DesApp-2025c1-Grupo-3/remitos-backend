#!/usr/bin/env node

/**
 * Script temporal para poblar la base de datos local
 * Crea: 25 Clientes, 25 Destinos, 25 Remitos (cada uno con 1 mercadería)
 * Mantiene relaciones correctas entre todas las entidades
 */

const { 
  Cliente, 
  Destino, 
  Remito, 
  Mercaderia, 
  Contacto, 
  Estado, 
  TipoEmpresa, 
  TipoMercaderia,
  sequelize
} = require('../lib/models');

// Datos de prueba
const CUIT_FIJO = '20414636080';

const nombresClientes = [
  'Distribuidora Norte S.A.', 'Comercial del Sur Ltda.', 'Importadora Central',
  'Logística Integral S.A.', 'Transportes Unidos', 'Almacén Mayorista',
  'Distribuidora Regional', 'Comercial Metropolitana', 'Servicios Logísticos',
  'Empresa de Transporte', 'Distribuidora Nacional', 'Comercial del Este',
  'Logística Express', 'Almacén Central', 'Transportes del Oeste',
  'Distribuidora Sur', 'Comercial Internacional', 'Servicios de Carga',
  'Empresa Distribuidora', 'Logística Avanzada', 'Comercial del Norte',
  'Transportes Nacionales', 'Distribuidora Principal', 'Almacén Mayor',
  'Servicios Integrales'
];

const direccionesClientes = [
  'Av. Corrientes 1234, CABA', 'Av. Santa Fe 5678, CABA', 'Av. Rivadavia 9012, CABA',
  'Av. Callao 3456, CABA', 'Av. Córdoba 7890, CABA', 'Av. Las Heras 2345, CABA',
  'Av. Scalabrini Ortiz 6789, CABA', 'Av. Pueyrredón 0123, CABA', 'Av. Corrientes 4567, CABA',
  'Av. Santa Fe 8901, CABA', 'Av. Rivadavia 2345, CABA', 'Av. Callao 6789, CABA',
  'Av. Córdoba 0123, CABA', 'Av. Las Heras 4567, CABA', 'Av. Scalabrini Ortiz 8901, CABA',
  'Av. Pueyrredón 2345, CABA', 'Av. Corrientes 6789, CABA', 'Av. Santa Fe 0123, CABA',
  'Av. Rivadavia 4567, CABA', 'Av. Callao 8901, CABA', 'Av. Córdoba 2345, CABA',
  'Av. Las Heras 6789, CABA', 'Av. Scalabrini Ortiz 0123, CABA', 'Av. Pueyrredón 4567, CABA',
  'Av. Corrientes 8901, CABA'
];

const nombresDestinos = [
  'Centro de Distribución Norte', 'Almacén Central Sur', 'Depósito Metropolitano',
  'Centro Logístico Este', 'Almacén Regional Oeste', 'Depósito Industrial',
  'Centro de Distribución Sur', 'Almacén Nacional', 'Depósito Comercial',
  'Centro Logístico Norte', 'Almacén Metropolitano', 'Depósito Regional',
  'Centro de Distribución Este', 'Almacén Industrial', 'Depósito Comercial Sur',
  'Centro Logístico Oeste', 'Almacén Nacional Norte', 'Depósito Metropolitano Sur',
  'Centro de Distribución Central', 'Almacén Regional Este', 'Depósito Industrial Norte',
  'Centro Logístico Sur', 'Almacén Comercial', 'Depósito Nacional Este',
  'Centro de Distribución Oeste'
];

const provinciasDestinos = [
  'Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Mendoza', 'Tucumán',
  'Entre Ríos', 'Salta', 'Chaco', 'Corrientes', 'Santiago del Estero',
  'San Juan', 'Jujuy', 'Río Negro', 'Formosa', 'Neuquén', 'Chubut',
  'San Luis', 'Catamarca', 'La Rioja', 'La Pampa', 'Misiones',
  'Santa Cruz', 'Tierra del Fuego', 'Buenos Aires'
];

const localidadesDestinos = [
  'La Plata', 'CABA', 'Córdoba', 'Rosario', 'Mendoza', 'San Miguel de Tucumán',
  'Paraná', 'Salta', 'Resistencia', 'Corrientes', 'Santiago del Estero',
  'San Juan', 'San Salvador de Jujuy', 'Viedma', 'Formosa', 'Neuquén',
  'Rawson', 'San Luis', 'San Fernando del Valle', 'La Rioja', 'Santa Rosa',
  'Posadas', 'Río Gallegos', 'Ushuaia', 'Mar del Plata'
];

const direccionesDestinos = [
  'Av. 7 1200, La Plata', 'Av. Corrientes 2000, CABA', 'Av. Colón 1500, Córdoba',
  'Av. Pellegrini 1800, Rosario', 'Av. San Martín 2200, Mendoza', 'Av. Sarmiento 1400, Tucumán',
  'Av. Urquiza 1600, Paraná', 'Av. Belgrano 1900, Salta', 'Av. 25 de Mayo 1700, Resistencia',
  'Av. 3 de Abril 2100, Corrientes', 'Av. Libertad 1300, Santiago del Estero',
  'Av. Córdoba 2400, San Juan', 'Av. 19 de Abril 1500, Jujuy', 'Av. Costanera 2600, Viedma',
  'Av. 25 de Mayo 1200, Formosa', 'Av. Argentina 2700, Neuquén', 'Av. Rawson 1800, Rawson',
  'Av. Illia 1600, San Luis', 'Av. República 2000, Catamarca', 'Av. Ortiz de Ocampo 1400, La Rioja',
  'Av. San Martín 2800, Santa Rosa', 'Av. Mitre 1700, Posadas', 'Av. San Martín 2900, Río Gallegos',
  'Av. Maipú 1300, Ushuaia', 'Av. Constitución 3000, Mar del Plata'
];

const nombresContactos = [
  'Juan Pérez', 'María González', 'Carlos Rodríguez', 'Ana Martínez', 'Luis Fernández',
  'Laura Sánchez', 'Roberto López', 'Carmen García', 'Diego Hernández', 'Isabel Díaz',
  'Miguel Torres', 'Elena Ruiz', 'Antonio Jiménez', 'Patricia Morales', 'Francisco Ortega',
  'Rosa Vargas', 'Manuel Romero', 'Teresa Navarro', 'José Herrera', 'Mónica Castro',
  'Pedro Delgado', 'Sandra Ramos', 'Fernando Moreno', 'Cristina Vega', 'Andrés Flores'
];

const emailsContactos = [
  'juan.perez@empresa.com', 'maria.gonzalez@comercial.com', 'carlos.rodriguez@logistica.com',
  'ana.martinez@distribuidora.com', 'luis.fernandez@transporte.com', 'laura.sanchez@almacen.com',
  'roberto.lopez@servicios.com', 'carmen.garcia@empresa.com', 'diego.hernandez@comercial.com',
  'isabel.diaz@logistica.com', 'miguel.torres@distribuidora.com', 'elena.ruiz@transporte.com',
  'antonio.jimenez@almacen.com', 'patricia.morales@servicios.com', 'francisco.ortega@empresa.com',
  'rosa.vargas@comercial.com', 'manuel.romero@logistica.com', 'teresa.navarro@distribuidora.com',
  'jose.herrera@transporte.com', 'monica.castro@almacen.com', 'pedro.delgado@servicios.com',
  'sandra.ramos@empresa.com', 'fernando.moreno@comercial.com', 'cristina.vega@logistica.com',
  'andres.flores@distribuidora.com'
];

const telefonosContactos = [
  '11-1234-5678', '11-2345-6789', '11-3456-7890', '11-4567-8901', '11-5678-9012',
  '11-6789-0123', '11-7890-1234', '11-8901-2345', '11-9012-3456', '11-0123-4567',
  '11-1357-2468', '11-2468-1357', '11-3579-2468', '11-4680-1357', '11-5791-2468',
  '11-6802-1357', '11-7913-2468', '11-8024-1357', '11-9135-2468', '11-0246-1357',
  '11-1470-2580', '11-2580-1470', '11-3691-2580', '11-4702-1470', '11-5813-2580'
];

const observacionesRemitos = [
  'Mercadería frágil, manejar con cuidado', 'Entrega urgente requerida', 'Verificar documentación',
  'Mercadería perecedera', 'Requerimiento especial de embalaje', 'Entrega programada',
  'Verificar identidad del receptor', 'Mercadería de alto valor', 'Entrega en horario comercial',
  'Verificar estado de la mercadería', 'Entrega con recibo firmado', 'Mercadería refrigerada',
  'Entrega coordinada previamente', 'Verificar dirección de entrega', 'Mercadería inflamable',
  'Entrega con inspección previa', 'Verificar autorización', 'Mercadería de gran volumen',
  'Entrega en planta baja', 'Verificar horarios de recepción', 'Mercadería con restricciones',
  'Entrega con fotografía', 'Verificar condiciones de almacenamiento', 'Mercadería clasificada',
  'Entrega con protocolo especial'
];

const requisitosEspeciales = [
  'Manejo cuidadoso', 'Refrigeración requerida', 'No apilar', 'Protección contra humedad',
  'Transporte vertical', 'Separación de otros productos', 'Ventilación adecuada',
  'Protección contra golpes', 'Manejo con guantes', 'No exponer al sol',
  'Temperatura controlada', 'Embalaje especial', 'Manipulación delicada',
  'Protección contra polvo', 'Transporte horizontal', 'Aislamiento térmico',
  'Protección contra vibraciones', 'Manejo con equipos especiales', 'Protección contra radiación',
  'Ventilación forzada', 'Protección contra campos magnéticos', 'Manejo en ambiente limpio',
  'Protección contra electricidad estática', 'Transporte con amortiguación', 'Manejo individual'
];

async function populateDatabase() {
  try {
    console.log('🚀 Iniciando población de base de datos...');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Obtener IDs de entidades de referencia
    const estados = await Estado.findAll();
    const tipoEmpresas = await TipoEmpresa.findAll();
    const tipoMercaderias = await TipoMercaderia.findAll();

    console.log(`📊 Estados disponibles: ${estados.length}`);
    console.log(`📊 Tipos de empresa disponibles: ${tipoEmpresas.length}`);
    console.log(`📊 Tipos de mercadería disponibles: ${tipoMercaderias.length}`);

    // Crear 25 Clientes
    console.log('👥 Creando clientes...');
    const clientes = [];
    for (let i = 0; i < 25; i++) {
      const cliente = await Cliente.create({
        razonSocial: nombresClientes[i],
        cuit_rut: CUIT_FIJO,
        direccion: direccionesClientes[i],
        tipoEmpresaId: tipoEmpresas[i % tipoEmpresas.length].id,
        activo: true
      });
      clientes.push(cliente);
    }
    console.log(`✅ ${clientes.length} clientes creados`);

    // Crear contactos para cada cliente
    console.log('📞 Creando contactos de clientes...');
    const contactosClientes = [];
    for (let i = 0; i < clientes.length; i++) {
      const contacto = await Contacto.create({
        personaAutorizada: nombresContactos[i],
        correoElectronico: emailsContactos[i],
        telefono: telefonosContactos[i],
        clienteId: clientes[i].id
      });
      contactosClientes.push(contacto);
    }
    console.log(`✅ ${contactosClientes.length} contactos de clientes creados`);

    // Crear 25 Destinos
    console.log('🏢 Creando destinos...');
    const destinos = [];
    for (let i = 0; i < 25; i++) {
      const destino = await Destino.create({
        nombre: nombresDestinos[i],
        pais: 'Argentina',
        provincia: provinciasDestinos[i],
        localidad: localidadesDestinos[i],
        direccion: direccionesDestinos[i],
        activo: true
      });
      destinos.push(destino);
    }
    console.log(`✅ ${destinos.length} destinos creados`);

    // Crear contactos para cada destino
    console.log('📞 Creando contactos de destinos...');
    const contactosDestinos = [];
    for (let i = 0; i < destinos.length; i++) {
      const contacto = await Contacto.create({
        personaAutorizada: nombresContactos[(i + 10) % nombresContactos.length],
        correoElectronico: emailsContactos[(i + 10) % emailsContactos.length],
        telefono: telefonosContactos[(i + 10) % telefonosContactos.length],
        destinoId: destinos[i].id
      });
      contactosDestinos.push(contacto);
    }
    console.log(`✅ ${contactosDestinos.length} contactos de destinos creados`);

    // Crear 25 Remitos con fechas distribuidas
    console.log('📋 Creando remitos...');
    const remitos = [];
    
    // Generar fechas distribuidas en los últimos 12 meses
    const fechasEmision = [];
    const fechaInicio = new Date();
    fechaInicio.setFullYear(fechaInicio.getFullYear() - 1); // Hace 1 año
    const fechaFin = new Date(); // Hoy
    
    for (let i = 0; i < 25; i++) {
      // Distribuir fechas de manera más realista:
      // - 40% en los últimos 3 meses (más recientes)
      // - 30% entre 3-6 meses atrás
      // - 20% entre 6-9 meses atrás  
      // - 10% entre 9-12 meses atrás
      
      let diasAtras;
      const random = Math.random();
      
      if (random < 0.4) {
        // 40% en últimos 90 días
        diasAtras = Math.random() * 90;
      } else if (random < 0.7) {
        // 30% entre 90-180 días
        diasAtras = 90 + Math.random() * 90;
      } else if (random < 0.9) {
        // 20% entre 180-270 días
        diasAtras = 180 + Math.random() * 90;
      } else {
        // 10% entre 270-365 días
        diasAtras = 270 + Math.random() * 95;
      }
      
      const fechaEmision = new Date();
      fechaEmision.setDate(fechaEmision.getDate() - diasAtras);
      fechaEmision.setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0); // Entre 8:00 y 16:00
      
      fechasEmision.push(fechaEmision);
    }
    
    // Ordenar fechas de más antigua a más reciente para asignar números de remito
    fechasEmision.sort((a, b) => a - b);
    
    for (let i = 0; i < 25; i++) {
      const remito = await Remito.create({
        numeroAsignado: `REM-${String(i + 1).padStart(3, '0')}`,
        fechaEmision: fechasEmision[i],
        observaciones: observacionesRemitos[i],
        prioridad: ['normal', 'alta', 'urgente'][i % 3],
        clienteId: clientes[i].id,
        destinoId: destinos[i].id,
        estadoId: estados[i % estados.length].id,
        activo: true
      });
      remitos.push(remito);
    }
    console.log(`✅ ${remitos.length} remitos creados`);

    // Crear 1 Mercadería para cada Remito
    console.log('📦 Creando mercaderías...');
    const mercaderias = [];
    for (let i = 0; i < remitos.length; i++) {
      const mercaderia = await Mercaderia.create({
        tipoMercaderiaId: tipoMercaderias[i % tipoMercaderias.length].id,
        valorDeclarado: Math.floor(Math.random() * 500000) + 50000, // Entre $50,000 y $550,000
        volumenMetrosCubico: Math.floor(Math.random() * 50) + 1, // Entre 1 y 50 m³
        pesoMercaderia: Math.floor(Math.random() * 5000) + 100, // Entre 100 y 5100 kg
        cantidadBobinas: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 1 : null,
        cantidadRacks: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : null,
        cantidadBultos: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 1 : null,
        cantidadPallets: Math.random() > 0.6 ? Math.floor(Math.random() * 15) + 1 : null,
        requisitosEspeciales: requisitosEspeciales[i],
        remitoId: remitos[i].id,
        activo: true
      });
      mercaderias.push(mercaderia);
    }
    console.log(`✅ ${mercaderias.length} mercaderías creadas`);

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   • ${clientes.length} Clientes creados`);
    console.log(`   • ${contactosClientes.length} Contactos de clientes creados`);
    console.log(`   • ${destinos.length} Destinos creados`);
    console.log(`   • ${contactosDestinos.length} Contactos de destinos creados`);
    console.log(`   • ${remitos.length} Remitos creados`);
    console.log(`   • ${mercaderias.length} Mercaderías creadas`);
    console.log(`   • Total de contactos: ${contactosClientes.length + contactosDestinos.length}`);
    
    // Mostrar distribución de fechas
    console.log('\n📅 Distribución de fechas de remitos:');
    const hoy = new Date();
    const hace3Meses = new Date(hoy.getTime() - 90 * 24 * 60 * 60 * 1000);
    const hace6Meses = new Date(hoy.getTime() - 180 * 24 * 60 * 60 * 1000);
    const hace9Meses = new Date(hoy.getTime() - 270 * 24 * 60 * 60 * 1000);
    
    let ultimos3Meses = 0;
    let entre3y6Meses = 0;
    let entre6y9Meses = 0;
    let entre9y12Meses = 0;
    
    fechasEmision.forEach(fecha => {
      if (fecha >= hace3Meses) {
        ultimos3Meses++;
      } else if (fecha >= hace6Meses) {
        entre3y6Meses++;
      } else if (fecha >= hace9Meses) {
        entre6y9Meses++;
      } else {
        entre9y12Meses++;
      }
    });
    
    console.log(`   • Últimos 3 meses: ${ultimos3Meses} remitos`);
    console.log(`   • 3-6 meses atrás: ${entre3y6Meses} remitos`);
    console.log(`   • 6-9 meses atrás: ${entre6y9Meses} remitos`);
    console.log(`   • 9-12 meses atrás: ${entre9y12Meses} remitos`);
    
    // Mostrar fechas extremas
    const fechaMasAntigua = fechasEmision[0];
    const fechaMasReciente = fechasEmision[fechasEmision.length - 1];
    console.log(`\n📆 Rango de fechas:`);
    console.log(`   • Más antigua: ${fechaMasAntigua.toLocaleDateString('es-AR')}`);
    console.log(`   • Más reciente: ${fechaMasReciente.toLocaleDateString('es-AR')}`);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
if (require.main === module) {
  populateDatabase()
    .then(() => {
      console.log('\n✨ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error en el script:', error);
      process.exit(1);
    });
}

module.exports = { populateDatabase };
