const { Sequelize } = require('sequelize');

// Configuración de conexión
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'desapp',
  logging: false
});

async function insertQuickData() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    // Insertar tipos de empresa
    console.log('🏢 Insertando tipos de empresa...');
    await sequelize.query(`
      INSERT INTO "TipoEmpresas" (nombre, descripcion, activo, "createdAt", "updatedAt") VALUES
      ('Particular', 'Persona física o particular', true, NOW(), NOW()),
      ('Empresa privada', 'Empresa del sector privado', true, NOW(), NOW()),
      ('Organismo estatal', 'Entidad gubernamental o estatal', true, NOW(), NOW())
      ON CONFLICT (nombre) DO NOTHING;
    `);
    console.log('✅ Tipos de empresa insertados');

    // Insertar tipos de mercadería
    console.log('📦 Insertando tipos de mercadería...');
    await sequelize.query(`
      INSERT INTO "TipoMercaderias" (nombre, descripcion, activo, "createdAt", "updatedAt") VALUES
      ('Automotriz', 'Productos relacionados con automóviles', true, NOW(), NOW()),
      ('Alimentos', 'Productos alimenticios', true, NOW(), NOW()),
      ('Textil', 'Productos textiles y ropa', true, NOW(), NOW()),
      ('Electrónica', 'Dispositivos electrónicos', true, NOW(), NOW()),
      ('Construcción', 'Materiales de construcción', true, NOW(), NOW()),
      ('Químicos', 'Productos químicos', true, NOW(), NOW()),
      ('Otros', 'Otros tipos de productos', true, NOW(), NOW())
      ON CONFLICT (nombre) DO NOTHING;
    `);
    console.log('✅ Tipos de mercadería insertados');

    // Insertar un cliente de prueba
    console.log('👤 Insertando cliente de prueba...');
    await sequelize.query(`
      INSERT INTO "Clientes" ("razonSocial", "cuit_rut", direccion, "tipoEmpresaId", activo, "createdAt", "updatedAt") VALUES
      ('Cliente Test S.A.', '30712345678', 'Av. Test 123, CABA', 2, true, NOW(), NOW())
      ON CONFLICT ("cuit_rut") DO NOTHING;
    `);
    console.log('✅ Cliente de prueba insertado');

    console.log('🎉 ¡Datos insertados exitosamente!');
    console.log('\n📋 Ahora puedes probar:');
    console.log('GET http://localhost:3002/api/tipos-empresa');
    console.log('GET http://localhost:3002/api/tipos-mercaderia');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

insertQuickData();
